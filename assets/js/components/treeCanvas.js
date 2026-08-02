/**
 * ==========================================================
 * Family Tree v2
 * treeCanvas.js
 * FamilyEcho Layout Engine
 * ==========================================================
 */

import { Store, getFilteredPeople } from "../store.js";
import { createTreeNode } from "./treeNode.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const canvas = document.querySelector("#treeCanvas");
const svg = document.querySelector("#treeSvg");
const nodes = document.querySelector("#treeNodes");

const NODE_WIDTH = 220;
const NODE_HEIGHT = 110;

const H_SPACE = 60;
const V_SPACE = 180;

let zoom = 1;
let panX = 40;
let panY = 40;

/* ==========================================================
   PUBLIC
========================================================== */

export function initializeTreeCanvas() {

    bindCanvasEvents();

    renderTree();

}

export function renderTree() {

    svg.innerHTML = "";
    nodes.innerHTML = "";

    const people = getFilteredPeople();

    const layout = buildFamilyLayout(people);

    drawConnections(layout);

    drawNodes(layout);

    updateTransform();

}

/* ==========================================================
   FAMILY LAYOUT
========================================================== */

function buildFamilyLayout(people){

    const map = new Map();

    people.forEach(person=>{

        map.set(person.id,{
            ...person,
            x:0,
            y:0,
            children:[]
        });

    });

    map.forEach(person=>{

        if(person.fatherId && map.has(person.fatherId)){

            map.get(person.fatherId)
                .children.push(person);

        }

        if(person.motherId && map.has(person.motherId)){

            map.get(person.motherId)
                .children.push(person);

        }

    });

    let currentX = 0;

    function layout(person,level){

        person.y = level * V_SPACE;

        if(person.children.length===0){

            person.x = currentX;

            currentX += NODE_WIDTH + H_SPACE;

            return;

        }

        person.children.forEach(child=>{

            layout(child,level+1);

        });

        const first = person.children[0];
        const last = person.children.at(-1);

        person.x =

            (first.x + last.x) / 2;

    }

    map.forEach(person=>{

        if(
            !person.fatherId &&
            !person.motherId
        ){

            layout(person,0);

        }

    });

    map.forEach(person=>{

        if(
            person.spouseId &&
            map.has(person.spouseId)
        ){

            const spouse = map.get(person.spouseId);

            spouse.x =

                person.x + NODE_WIDTH + 30;

            spouse.y = person.y;

        }

    });

    return [...map.values()];

}

/* ==========================================================
   DRAW
========================================================== */

function drawNodes(layout){

    layout.forEach(person=>{

        nodes.appendChild(

            createTreeNode(person)

        );

    });

}

/* ==========================================================
   CONNECTIONS
========================================================== */

function drawConnections(layout){

    const map = new Map();

    layout.forEach(p=>map.set(p.id,p));

    layout.forEach(child=>{

        if(child.fatherId){

            const father = map.get(child.fatherId);

            if(father){

                connect(father,child);

            }

        }

        if(child.motherId){

            const mother = map.get(child.motherId);

            if(mother){

                connect(mother,child);

            }

        }

        if(child.spouseId){

            const spouse = map.get(child.spouseId);

            if(spouse){

                connectSpouse(child,spouse);

            }

        }

    });

}

function connect(parent,child){

    createCurve(

        parent.x + NODE_WIDTH/2,

        parent.y + NODE_HEIGHT,

        child.x + NODE_WIDTH/2,

        child.y

    );

}

function connectSpouse(a,b){

    const line = document.createElementNS(

        SVG_NS,

        "line"

    );

    line.setAttribute(

        "x1",

        a.x + NODE_WIDTH

    );

    line.setAttribute(

        "y1",

        a.y + NODE_HEIGHT/2

    );

    line.setAttribute(

        "x2",

        b.x

    );

    line.setAttribute(

        "y2",

        b.y + NODE_HEIGHT/2

    );

    line.setAttribute("stroke","#49d67f");

    line.setAttribute("stroke-width","3");

    svg.appendChild(line);

}

function createCurve(x1,y1,x2,y2){

    const path = document.createElementNS(

        SVG_NS,

        "path"

    );

    const m = (y1+y2)/2;

    path.setAttribute(

        "d",

        `M ${x1} ${y1}
         C ${x1} ${m}
           ${x2} ${m}
           ${x2} ${y2}`

    );

    path.setAttribute("fill","none");

    path.setAttribute("stroke","#49d67f");

    path.setAttribute("stroke-width","3");

    path.classList.add("tree-line");

    svg.appendChild(path);

}

/* ==========================================================
   ZOOM
========================================================== */

export function zoomIn(){

    zoom=Math.min(zoom+0.1,2.5);

    updateTransform();

}

export function zoomOut(){

    zoom=Math.max(zoom-0.1,0.3);

    updateTransform();

}

export function resetZoom(){

    zoom=1;

    panX=40;

    panY=40;

    updateTransform();

}

export function centerTree(){

    panX=40;

    panY=40;

    updateTransform();

}

export function fitTree(){

    zoom=1;

    centerTree();

}

function updateTransform(){

    const t=

        `translate(${panX}px,${panY}px) scale(${zoom})`;

    nodes.style.transform=t;

    svg.style.transform=t;

}

function bindCanvasEvents(){

    /* sama seperti versi Anda */

}

Store.subscribe(renderTree);
