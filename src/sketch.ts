// -------------------
//  Parameters and UI
// -------------------

const gui = new dat.GUI()
const params = {
    curvesnumber: 10,
    numberplot:5,
    numberpts:8,
    translateblackx:15,
    translateblacky:15,
    translateblue:10,
    translatecurves:2,
    Download_Image: () => save(),
}

gui.add(params, "curvesnumber", 0, 30, 1)
gui.add(params, "numberplot", 1, 30, 1)
gui.add(params, "translateblackx", -30, 30, 1)
gui.add(params, "translateblacky", -30, 30, 1)
gui.add(params, "translateblue", -30, 30, 1)
gui.add(params, "translatecurves", -30, 30, 1)
gui.add(params, "Download_Image")

// -------------------
//       Drawing
// -------------------


function pt(x,y){
    //initialize a point
    return { x: x, y: y }
}

function translatept(p,dec){
    //1 in 2 chance of changing the x and y coordinates of a point
    if (random(1)>0.5)
        return { x: p.x+dec, y: p.y+dec}
    else
        return p
}

function translateptx(p,dec){
    //change the x coordinate of a point
    return { x: p.x+dec, y: p.y+dec}
}

function tofilllist (n){
    //initializes a list of n points
    let l=[]
    for (let i=0;i<n;i++){
        let p=pt(0,0)
        l=append(l,p)
    }
    return l
}

function plotcurves(p1,p2,p3,p4){
    curve(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y,p4.x, p4.y)
}


function forbidden(p,pe){
    //tests if the coordinates of p are well placed
    // pe will be a point of the small ellipse
    let test=false
    if((p.x>width)||(p.x<0)){//x out
        test=true
    }
    if ((p.y>height)||(p.y<0)){//y out
        test=true
    }
    //if the point is in the small ellipse
    // test by cutting the sheet into four parts (bottom right, bottom left, top right, top left)
    if ((((p.x>width/2) && (p.y>height/2) && (p.x<pe.x) && (p.y<pe.y))
        ||((p.x<width/2) && (p.y>height/2) && (p.x>pe.x) && (p.y<pe.y))
        ||((p.x>width/2) && (p.y<height/2) && (p.x<pe.x) && (p.y>pe.y))
        ||((p.x<width/2) && (p.y<height/2) && (p.x>pe.x) && (p.y>pe.y))))
    {
        test=true
    }
    
    return test
}


function draw() {

    randomSeed(0)
    background("white")

    //table which will contain our lists of points
    let listep=[];

    //parameters of the large ellipse
    // the first point of the curve must be near its contour
    let pc=pt(width/2,height/2)
    let a=pc.x-width/20
    let b=pc.y-height/20


    //parameters of the small ellipse where no point must be
    let ai=pc.x-width/10
    let bi=pc.x-width/10
    let pe;
    
    //index which will allow to use the correct list of points in listep
    let ind=0

    noFill()
    
    
    for (let z=0;z<2*PI;z=z+2*PI/params.numberplot){
        //we implement z so that it is between 0 and 2PI
        // to calculate the points of our ellipses
        // z is not integer hence the interest of ind to browse listep

        // initialize the list to be able to use it
        listep=append(listep,[tofilllist(params.numberpts+2)]) 

        //calculate from the point of our small ellipse for this turn
        pe=pt(pc.x+ai*cos(z),pc.y+bi*sin(z))
        
        //calculate the first point to draw the first curve
        // we use noise so that the point is not initialized in the vicinity of the contour of the ellipse
        // so give more possibilities
        //black
        listep[ind][0]=pt(pc.x+noise(pc.x+a*cos(z),pc.y+b*sin(z))*a*cos(z),pc.y+noise(pc.x+a*cos(z),pc.y+b*sin(z))*b*sin(z))
        //blue 
        // we add an offset for the blue curve compared to the black one
        listep[ind][params.numberpts+1]=pt(pc.x+params.translateblue+noise(pc.x+params.translateblue+a*cos(z),pc.y+b*sin(z))*a*cos(z),pc.y+noise(pc.x+a*cos(z),pc.y+b*sin(z))*b*sin(z))

        //calculation of other points
        for (let j=1;j<params.numberpts+1;j++){
            //randomly chosen point near the previous point
            let p = pt(randomGaussian(listep[ind][j-1].x,params.translateblackx),randomGaussian(listep[ind][params.numberpts+1].y,params.translateblacky))
            
            //we change if the point is badly placed
            while(forbidden(p,pe)){
                p=pt(randomGaussian(listep[ind][j-1].x,params.translateblackx),randomGaussian(listep[ind][params.numberpts+1].y,params.translateblacky))
            
            }
            listep[ind][j]=pt(randomGaussian(listep[ind][j-1].x,params.translateblackx),randomGaussian(listep[ind][params.numberpts+1].y,params.translateblacky))
            
        }

        //plotting curves
        for (let i=0;i<params.curvesnumber;i++){
            //blue
            // we draw several pieces of curves
            // with the point pb calculated previously
            // then the 8 other points which will be used for the black curves but with an offset on the x coordinate
            stroke(0,0,255,20)

            plotcurves(listep[ind][params.numberpts+1],translateptx(listep[ind][1],params.translateblue),translateptx(listep[ind][2],params.translateblue),translateptx(listep[ind][3],params.translateblue))
            plotcurves(translateptx(listep[ind][1],params.translateblue),translateptx(listep[ind][2],params.translateblue),translateptx(listep[ind][3],params.translateblue),translateptx(listep[ind][4],params.translateblue))
            plotcurves(translateptx(listep[ind][2],params.translateblue),translateptx(listep[ind][3],params.translateblue),translateptx(listep[ind][4],params.translateblue),translateptx(listep[ind][5],params.translateblue))
            plotcurves(translateptx(listep[ind][3],params.translateblue),translateptx(listep[ind][4],params.translateblue),translateptx(listep[ind][5],params.translateblue),translateptx(listep[ind][6],params.translateblue))
            plotcurves(translateptx(listep[ind][4],params.translateblue),translateptx(listep[ind][5],params.translateblue),translateptx(listep[ind][6],params.translateblue),translateptx(listep[ind][7],params.translateblue))
            plotcurves(translateptx(listep[ind][5],params.translateblue),translateptx(listep[ind][6],params.translateblue),translateptx(listep[ind][7],params.translateblue),translateptx(listep[ind][8],params.translateblue))
            plotcurves(translateptx(listep[ind][6],params.translateblue),translateptx(listep[ind][7],params.translateblue),translateptx(listep[ind][8],params.translateblue),listep[ind][params.numberpts+1])
            plotcurves(translateptx(listep[ind][7],params.translateblue),translateptx(listep[ind][8],params.translateblue),listep[ind][params.numberpts+1],translateptx(listep[ind][1],params.translateblue))
            plotcurves(translateptx(listep[ind][8],params.translateblue),listep[ind][params.numberpts+1],translateptx(listep[ind][1],params.translateblue),translateptx(listep[ind][2],params.translateblue))
            

            //drawing of the black curve using the same process as the blue one
            stroke(0,0,0,50)
            plotcurves(listep[ind][0],listep[ind][1],listep[ind][2],listep[ind][3])
            plotcurves(listep[ind][1],listep[ind][2],listep[ind][3],listep[ind][4])
            plotcurves(listep[ind][2],listep[ind][3],listep[ind][4],listep[ind][5])
            plotcurves(listep[ind][3],listep[ind][4],listep[ind][5],listep[ind][6])
            plotcurves(listep[ind][4],listep[ind][5],listep[ind][6],listep[ind][7])
            plotcurves(listep[ind][5],listep[ind][6],listep[ind][7],listep[ind][8])
            plotcurves(listep[ind][6],listep[ind][7],listep[ind][8],listep[ind][0])
            plotcurves(listep[ind][7],listep[ind][8],listep[ind][2],listep[ind][1])
            plotcurves(listep[ind][8],listep[ind][0],listep[ind][1],listep[ind][2])

            //translating points for the next loop round
            for (let s=0;s<params.numberpts+2;s++){
                listep[ind][s]=translatept(listep[ind][s],params.translatecurves)
            }
        }
        ind++
    }
}

// -------------------
//    Initialization
// -------------------

function setup() {
    p6_CreateCanvas()
}

function windowResiinded() {
    p6_ResizeCanvas()
}