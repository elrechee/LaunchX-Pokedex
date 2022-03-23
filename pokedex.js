var Pokemon = {no:"", nombre: "", tipos:["",""],
                peso:0, altura: 0, descURL: "",
                imgURL: ["","","",""]};
var PokeDesc = {juego:[], texto: []};
var indx = 0;

const aux_nombre = document.getElementById("outNombre");
const aux_type1 = document.getElementById("type1");
const aux_type2 = document.getElementById("type2");
const aux_altura = document.getElementById("outAltura");
const aux_peso = document.getElementById("outPeso");
const aux_MF = document.getElementById("btn_FM");
const aux_SH = document.getElementById("btn_SH");
const aux_IMG = document.getElementById("img-pkm");
const aux_desc = document.getElementById("outDesc");
const aux_sel = document.getElementById("sel_desc");
const img_MF = document.getElementById("img_MF")

const Pokerand = function(){
    fetchPokemon(Math.floor(897*Math.random()+1));
}

 const BuscarPoke = function(){
    const inbuscar = document.getElementById("input_buscar").value.toLowerCase();
    aux_buscar = inbuscar.replace(/ /g, "");
    if(aux_buscar!="")
        fetchPokemon(inbuscar);
    
 }

 function clickPress(e) {
    if (e.keyCode == 13)
        BuscarPoke();

 }

 aux_sel.addEventListener("change", (e) => {
    aux_desc.innerText = PokeDesc.texto[aux_sel.selectedIndex];
  });

 const fetchDesc = function(){
    let aux_texto = [];
    let aux_juegos = [];
    let aux_value = 0; //indice auxiliar para que los options del select tengan indices numerados
    
     fetch (Pokemon.descURL).then((res)=>{
        
        if (res.status != "200") {
             console.log(res);
             errors();
        }
        else {
            return res.json();
        }
     }).then((data)=>{
         if(data){
             console.log(data);
             //remover todos los elementos del select
             aux_sel.innerHTML = "";
             for (let i = 0 ; i < data.flavor_text_entries.length; i++ ){
                 if (data.flavor_text_entries[i].language.name =='es'){
                     //crear un select con las diferentes descripciones de los diferentes juegos
                     var aux_option = document.createElement('option');
                     aux_option.innerText = data.flavor_text_entries[i].version.name;
                     aux_option.value = aux_value;
                     aux_sel.appendChild(aux_option);
                     aux_value++;

                     //guardar las distintas descripciones en un arreglo
                    aux_texto.push(data.flavor_text_entries[i].flavor_text.replace(/\n/g, " "));
                    aux_juegos.push(data.flavor_text_entries[i].version.name);
                 }
             }

             PokeDesc.texto = aux_texto;
             PokeDesc.juego = aux_juegos;
             mostrarPKM();
             console.log(PokeDesc.texto[0]);
            }
     });
 }

const fetchPokemon = function(buscar){

    //buscar el pokemon indicado
    const url = `https://pokeapi.co/api/v2/pokemon/${buscar}`;
    fetch(url).then((res) => {
        if (res.status != "200") {
            console.log(res);
            errors();
        }
        else {
            return res.json();
        }
    }).then((data) => {
        if (data) {
            console.log(data);
            Pokemon.no = data.id;
            Pokemon.nombre = data.name;
            Pokemon.altura = data.height/10;
            Pokemon.peso = data.weight/10;
            Pokemon.imgURL = [data.sprites.front_default, data.sprites.front_female, 
                                data.sprites.front_shiny, data.sprites.front_shiny_female];
            Pokemon.tipos = [data.types[0].type.name, ""];
            Pokemon.descURL = data.species.url;
            if (data.types.length == 2){
                Pokemon.tipos[1]=data.types[1].type.name;
            }
            
            fetchDesc();
        }
    });
}

const sigPoke = function(aux){
    let aux_num = Pokemon.no;
    if(aux)
        aux_num = (aux_num%898) + 1;
    else 
        aux_num = (aux_num+896)%898 +1;
        
    fetchPokemon(aux_num);
}

const cambioSH = function(){
    if (indx>1){
        //aux_SH.style.background = "rgba(250, 252, 255, 0.7)";
        indx = indx - 2;
    }
        
    else{
        //aux_SH.style.background = "rgba(36, 37, 70, 0.7);";
        indx = indx + 2;
    }
    

    aux_IMG.src = Pokemon.imgURL[indx];
    console.log(Pokemon.imgURL[indx]);

}

//Funcion usada cuando se presiona el boton para cambiar version masculina/femenina
const cambioMF = function(){
    if((indx%2) ==0){
        indx++;
        img_MF.src = "./img/female.png"
    }
        
    else{
        indx--;
        img_MF.src = "./img/male.png"
    }
        

/*
    if (indx>1)
        indx = (indx+1)%2 +2;
    else
        indx = (indx+1)%2;*/

    aux_IMG.src = Pokemon.imgURL[indx];
    console.log(Pokemon.imgURL[indx]);
               
    
}

const mostrarPKM = function(){  
    aux_nombre.innerText = `# ${Pokemon.no}    ${Pokemon.nombre} `;
    aux_type1.innerText = Pokemon.tipos[0];
    aux_type2.innerText = Pokemon.tipos[1];
    aux_altura.innerText = `${Pokemon.altura} mts.`;
    aux_peso.innerText = `${Pokemon.peso} kg.`
    aux_IMG.src = Pokemon.imgURL[0];
    aux_desc.innerText = PokeDesc.texto[0];
    indx = 0 ;

    if(Pokemon.imgURL[1])
        aux_MF.style.visibility = 'visible';
    else
        aux_MF.style.visibility = 'hidden';

    aux_SH.style.visibility = 'visible';
    aux_sel.style.visibility = 'visible';
}

const errors = function(){
    Pokemon.no = 0;
    Pokemon.nombre = "NO ENCONTRADO";
    Pokemon.tipos = ["???", "???"]
    Pokemon.imgURL[0] = "./img/missigno.png";
    Pokemon.altura = "???";
    Pokemon.peso = "???";
    PokeDesc.texto[0]="Parece que hemos tenido un problema al buscar la informacion\n revisa tu conexion o asegurate de escribir correctamente el nombre del pokemon";

    mostrarPKM();

    aux_MF.style.visibility = 'hidden';
    aux_SH.style.visibility = 'hidden';
    aux_sel.style.visibility = 'hidden';
}

Pokerand();