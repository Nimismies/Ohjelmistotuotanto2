var lvl1Score = 0; //oliko tälleen globalien muuttujien tekeminen jotenkin tyhmää?
var lvl2Score = 0; //oon ehkä joskus kuullut että on
var lvl3Score = 0;
var lvl4Score = 0;
var totalScore = 0;
var askedFile = "";
var cont0Array; //jos tekee lisää containereita, se vaatii uuden ShuffleX() function, sekä contXArrayn säilyttääkseen numeron.
var cont1Array;
var cont2Array;
var lvl;

var jTmp = 0;
var nrOfFileBeingAsked = 0;
var toAskArray = new Array;
var originalFilesString = "";


//koitettaan tehä silleen että kaikki pelin toiminnallisuus on yhessä .js tiedostossa?
//törmättiinkö joskus syyhyn että miks niin ei kannata tehä?
//jos törmättiin niin sanokaa kthx

function ChangeBg(lvl) //käytetään ekassa levussa jotta vaihdetaan se tausta siksi ei-niin-luettavaksi
{

  document.getElementById("playField").style.backgroundImage = "url(images/24.png)";
  StartLevel(lvl);
}
function StartLevel(lvl)

{
  var rect = document.getElementById("asiakaslista.txt").getBoundingClientRect();
console.log(rect.top, rect.right, rect.bottom, rect.left);
  lvl = lvl;
  if(typeof(Storage) == "undefined")
    {
      alert("Unfortunately your browser does not support our game"); //keksitään jos keksitään että mitä vittua sitten tehää jos on paska / vanha selain
    }
    if (lvl === 1) //jos lvl 1, divien järjestys shufflataan, jos on joku muu levu, divien järjestys haetaan sessionstoragesta
    {
      
      var originalFilesList = document.getElementsByClassName("row");
      for (var i = 0; i < originalFilesList.length; i++)
      {
        originalFilesString += (JSON.stringify(originalFilesList[i], ["id"]));
      }
      sessionStorage.setItem("originalFilesString", originalFilesString);
      Shuffle();
      CreateAskedFileList();
      Timer(lvl);
      changeAskedFile(lvl);
    }
    else if (lvl ==2)
    {
      removeOldFiles();
      var cont0FromStorage = sessionStorage.getItem("container");
      LoadFileOrder(cont0FromStorage, "container", lvl);
      SelectFilesToFadeout(lvl);
      //lvl 2 Timer() ja ChangeAskedFile() funktion kutsut ovat FadeOutExtras() funktion alla jotta ajastin / peli ei ala ennenkuin ylimääräiset on poistettu
    }
    else if (lvl == 3)
    {
      var j = 1;
      var sortedContainerList = [];
      // Poistetaan vanhat jutut ja laitetaan tilalle uudet
      removeOldFiles();
      var cont0FromStorage = sessionStorage.getItem("container");
      LoadFileOrder(cont0FromStorage, "container", lvl);
      // Luodaan poistettavien kuvien taulukko
      var removeFiles = ["readme.txt", "kauppalista.txt", "joululauluja.txt", "saunanlämmitysohjeet.txt", "mökki.txt", "turha.txt" , "steaminstaller.exe", 
                          "virus.exe", "openJDK11U.exe", "winrar.exe", "asentaja.exe", "velho.exe", "jee.jpg", "lomakuva.jpg", "aa.jpg", "koulukuva.jpg", 
                          "joulukortti.jpg", "meemi.jpg", "soittoääni.mp3", "herätysääni.mp3", "ringtone.mp3", "song.mp3", "mökkiääni.mp3", "perjantai.mp3"];
      var removeFiles2 = ["asiakaslista.txt", "cv.txt", "käyttöohjeet.txt", "muistiinpanot.txt", "osallistujat.txt", "suunnitelma.txt",
                          "chrome.exe", "discordinstaller.exe", "installer.exe", "mökkivarausjärjestelmä.exe", "visualstudio.exe", "vlc.exe",
                          "auto.jpg", "banner.jpg", "header.jpg", "kopio.jpg", "mökkimaisema.jpg", "taustakuva.jpg", 
                          "beep.mp3", "clicksound.mp3", "effect.mp3", "notification.mp3", "soundtrack.mp3", "voice.mp3"];
      // foreach loopin poistofunktio
      function deleteFiles (item)
      {
        var element = document.getElementById(item);
        element.remove();
      }
      // käydään poistettavien lista läpi foreach
      removeFiles.forEach(deleteFiles);
    
      // haetaan container lapset
      var containerChild = document.getElementById("container").childNodes;
      // luodaan lajiteltu taulukko kuvista
      while(j <= 4)
      { 
        // loop alkaa numerosta 57, koska sieltä alkaa lajiteltavat kuvat
        for(var i = 57;i <= 80; i++)
        {
          // haetaan lisättävän kuvan id
          var divId = containerChild[i].id;
          // ensin haetaan txt tiedostot.
          if(j == 1 && divId.includes(".txt"))
          {
            // listaan työnnetään lapsen id containerChild muuttujasta
            sortedContainerList.push(containerChild[i].id);
          }

          if(j == 2 && divId.includes(".exe"))
          {
            sortedContainerList.push(containerChild[i].id);
          }

          if(j == 3 && divId.includes(".jpg"))
          {
            sortedContainerList.push(containerChild[i].id);
          }

          if(j == 4 && divId.includes(".mp3"))
          {
            sortedContainerList.push(containerChild[i].id);
          }
        }
        j++;
      }
      // poistellaan vielä toiset kuvat
      removeFiles2.forEach(deleteFiles);
      // tässä laitetaan lajitellut kuvat oikeille paikoille
      for (var i = 0; i < sortedContainerList.length; i++)  //luo luetusta stringistä uuden div elementin, asettaa sen containerin alle, ja lisää sille tarvittavat id:t ja onclick funktiot
      {
        var newDiv = document.createElement("div");
        var txtElem = document.createElement("p");
        
        newDiv.setAttribute("id", sortedContainerList[i]);
        newDiv.setAttribute("onclick", "ClickedRight(this, " + lvl.toString() + ")");
        newDiv.setAttribute("class", "row");
        document.getElementById("container").appendChild(newDiv);
        
        var newImg = document.createElement("img");
        if (sortedContainerList[i].includes(".txt"))
        {
          newImg.src = "images/txt.PNG";
          newImg.style.width = "60px";
          newImg.style.height = "60px";
        }
        else if(sortedContainerList[i].includes(".exe"))
        {
          newImg.src = "images/exe.PNG";
          newImg.style.width = "60px";
          newImg.style.height = "60px";
        }
        else if(sortedContainerList[i].includes(".jpg"))
        {
          newImg.src = "images/jpg.PNG";
          newImg.style.width = "60px";
          newImg.style.height = "60px";
        }
        else if(sortedContainerList[i].includes(".mp3"))
        {
          newImg.src = "images/mp3.PNG";
          newImg.style.width = "60px";
          newImg.style.height = "60px";
        }
        newDiv.appendChild(newImg);
        newDiv.innerHTML += '<p id="fileText">' + sortedContainerList[i] + '</p>'
      }

      Timer(lvl);
      changeAskedFile(lvl);
    }
    else if (lvl == 4)
    {
      SelectFilesToFadeout(lvl);
    }   
}


function SessionStorageParser(string, array) //Aika monessa kohassa mitä Arttu on tehnyt joudun session storageen parseemaan arrayn stringiksi niin tein sille yhen funktion
{                                           //funktio ottaa vastaan stringin joka tulee sessionstoragesta tietyssä muodossa kysy millaisessa jos haluat
  var tmpString = "";                       //for loop käy stringin merkit läpi ja erottelee niistä tekstit esim tiedosto1.png, ja lisää ne sanoittain arrayhyn, joka palautetaan
  for (var i = 0; i <= string.length; i++)
  {
    if (string.charAt(i) === "\"")
    {
      i=i+1;
      while(string.charAt(i) != "\"")
      {
        tmpString += string.charAt(i);
        i++
      }
      array.push(tmpString);
      tmpString = "";
    }
  }
  return array;
}
function CreateAskedFileList() //luo arrayn tiedostonimistä ja tallentaa ne sessionstorageen,
{                             //myöhemmin se parsetaan SessionStorageParser()funktiolla käytettäväksi arrayksi
  var filesToAskList = ["asiakaslista.txt", "cv.txt", "käyttöohjeet.txt", "muistiinpanot.txt", "osallistujat.txt", "suunnitelma.txt",
                        "chrome.exe", "discordinstaller.exe", "installer.exe", "mökkivarausjärjestelmä.exe", "visualstudio.exe", "vlc.exe",
                        "auto.jpg", "banner.jpg", "header.jpg", "kopio.jpg", "mökkimaisema.jpg", "taustakuva.jpg", 
                        "beep.mp3", "clicksound.mp3", "effect.mp3", "notification.mp3", "soundtrack.mp3", "voice.mp3"];
  var filesToAskListString = JSON.stringify(filesToAskList);
  sessionStorage.setItem("FilesToAskString", filesToAskListString);
}

function SelectFilesToFadeout(lvl) //valitsee tiedostot joita *EI* poisteta, voipi joskus nimetä uudestaan muuttujat yms kuvaamaan tätä paremmin
{
  var dontRemoveArray = new Array;
  SessionStorageParser(sessionStorage.getItem("FilesToAskString"), dontRemoveArray);
  var originalFilesArray = new Array
  SessionStorageParser(sessionStorage.getItem("originalFilesString"), originalFilesArray);
    for (var i = 0; i < originalFilesArray.length; i++)
    {
      for (var j = 0; j < dontRemoveArray.length; j++)
      {
        if (dontRemoveArray[j] === originalFilesArray[i])
        {
          var dontDelete = document.getElementById(originalFilesArray[i]);
          dontDelete.setAttribute("class", "dontRemove");
        }
      }
    }
  FadeOutExtras(lvl);
}

function FadeOutExtras(lvl)
{
  var container = document.getElementById("container");
  var removeArray = Array.prototype.slice.call(container.getElementsByClassName('row'));
  var opacity = 1;
  if(lvl === 2)  //jos on lvl2 niin tehdään fade, muuten tehdään vaan poisto
  {
  var fadeInterval = setInterval(FadeOutFunc, 111);
    function FadeOutFunc() //else lauseen alla asettaa elementin opacityä, iffin alla poistetaan elementti kun sen opacity on saavuttanut 0
    {
      if (opacity <= 0) 
      {
        clearInterval(fadeInterval);
        removeArray.forEach(function(element)
        {
          element.setAttribute("src", "images/empty.PNG"); //ei poista ylimääräisiä elementtejä, laittaa niiden kuvakkeen näkymättömäksi ja poistaa teksti lapsen
          element.removeChild;
        })
        Timer(lvl);
        changeAskedFile(lvl);
      } 
      else 
      {
        opacity = opacity - 0.1;
        for (var i = 0; i < removeArray.length; i++)
        {
          removeArray[i].style.opacity = opacity;
        }
      }
    }
  }
  else
  {
    for (var i = 0; i < removeArray.length; i++)
    {
      removeArray[i].style.opacity = 0;
    }
    removeArray.forEach(function(element)
    {
      console.log("foreach");
      element.setAttribute("src", "images/empty.PNG"); //ei poista ylimääräisiä elementtejä, laittaa niiden kuvakkeen näkymättömäksi ja poistaa teksti lapsen
      element.removeChild;
    })
    Timer(lvl);
    changeAskedFile(lvl);
  }

  var setClassesArray = Array.prototype.slice.call(document.getElementsByClassName("dontRemove"));  //muuttaa ei poistettujen divien classit takaisin jotta teksti pysyy missä pitäisi
  for (var i = 0; i < setClassesArray.length; i++)
  {
    setClassesArray[i].setAttribute("class", "row");
  }
}

function changeAskedFile(lvl) //asettaa tiedoston kysyjän näkyväksi ja muokkaa sen tekstin. Vaihtaa askedfile tiedoston nimen jota voi käyttää klikkauksen vertailussa.
{
  var toAskArray = new Array;
  SessionStorageParser(sessionStorage.getItem("FilesToAskString"), toAskArray);
  document.getElementById("fileAskerDiv").innerHTML = '<p id="fileAskerText">Etsi tiedosto nimeltä: '+ toAskArray[nrOfFileBeingAsked] + '</p>' ;  //laitetaan uusi <p> jossa kysytään tiedosto x
  document.getElementById('fileAskerText').style.visibility = "visible";  //laitetaan tiedoston kysyjän teksti näkyväksi, sillä se alkaa näkymättömänä
  askedFile = toAskArray[nrOfFileBeingAsked];
  nrOfFileBeingAsked++;

  if (nrOfFileBeingAsked > 24)
  {
    OutOfTime(lvl);
  }
  }

function ClickedRight(elem, lvl) //Ottaa parametriksi elementin, tässä tapauksessa divin
{
  var elemId = elem.id;
  
  if (elemId == askedFile) //Vertaa klikatun divin id:ta askedFileen
  {
    elem.classList.toggle('feidaus');
    switch(lvl)
    {
        case 1: lvl1Score++;
        break;
        case 2: lvl2Score++;
        break;
        case 3: lvl3Score++;
        break;
        case 4: lvl4Score++;
        break;
        default: 
            alert("error in game: valid level not selected in clicked right");
    }
    changeAskedFile(lvl);
  }
}
function ClickedWrong()
{
    //keksi jotain väärän klikkauksen juttua tähän
}

function SaveFileOrder(array, contString)//parametreinä shuffle funktion elementsArray, sekä kyseisen kohdan containerin nimi
{
  var arrayToString = new Array;
  for (var i = 0; i <= array.length; i++)
  {
    arrayToString.push(JSON.stringify(array[i], ["id"]));
    sessionStorage.setItem(contString, arrayToString); //tallentaa div elementtien id:t stringiksi
  } 
}

function LoadFileOrder(containerStr, contName, lvl) //parametreinä session storagesta getattu stringi, sekä containerin nimi ja kyseinen lvl
{ 
  var tmpStr = "";
  var tmpStrArray = new Array;
  for (var i = 0; i <= containerStr.length; i++) //tän for loop helvetin vois kääntää käyttämään SessionStorageParser() funktiota joskus kun on inspistä jollain
  {                                             //tää tehtiin ennen kun loin sen parser funktion niin siks on tällasenaa täällä
    if (containerStr.charAt(i) === ":") //lukee sessionstorageen tallennetusta stringistä tiedoston id:n
    {
      i=i+2;
      while(containerStr.charAt(i) != "\"")
      {
        tmpStr += containerStr.charAt(i);
        i++;
      }
      tmpStrArray.push(tmpStr);
      tmpStr = "";
    }
  }
  for (var i = 0; i < tmpStrArray.length; i++)  //luo luetusta stringistä uuden div elementin, asettaa sen containerin alle, ja lisää sille tarvittavat id:t ja onclick funktiot
  {
    var newDiv = document.createElement("div");
    var txtElem = document.createElement("p");
    
    newDiv.setAttribute("id", tmpStrArray[i]);
    newDiv.setAttribute("onclick", "ClickedRight(this, " + lvl.toString() + ")");
    newDiv.setAttribute("class", "row");
    document.getElementById(contName).appendChild(newDiv);
    
    var newImg = document.createElement("img");
    if (tmpStrArray[i].includes(".txt"))
    {
      newImg.src = "images/txt.PNG";
      newImg.style.width = "60px";
      newImg.style.height = "60px";
    }
    else if(tmpStrArray[i].includes(".exe"))
    {
      newImg.src = "images/exe.PNG";
      newImg.style.width = "60px";
      newImg.style.height = "60px";
    }
    else if(tmpStrArray[i].includes(".jpg"))
    {
      newImg.src = "images/jpg.PNG";
      newImg.style.width = "60px";
      newImg.style.height = "60px";
    }
    else if(tmpStrArray[i].includes(".mp3"))
    {
      newImg.src = "images/mp3.PNG";
      newImg.style.width = "60px";
      newImg.style.height = "60px";
    }
    newDiv.appendChild(newImg);
    newDiv.innerHTML += '<p id="fileText">' + tmpStrArray[i] + '</p>'
  }

}

function removeOldFiles()
{
  var container = document.getElementById("container");
  var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('row'));
  elementsArray.forEach(function(element)
  {
    container.removeChild(element);
  })

}

function Shuffle() //jos joku haluaa olla siisti niin tehkää 0/shuffle1/shuffle2/jne yheksi funktioksi #optimization .
{
  var container = document.getElementById("container");
  var elementsArray = Array.prototype.slice.call(container.getElementsByClassName('row'));
  elementsArray.forEach(function(element)
  {
    container.removeChild(element);
  })
  //shuffleArray(elementsArray);
  SaveFileOrder(elementsArray, "container");
  //sessionStorage.setItem("cont0Array", JSON.stringify(elementsArray));
  //console.log(JSON.stringify(elementsArray));
  elementsArray.forEach(function(element)
  {
    container.appendChild(element);
  })
}


function shuffleArray(array) 
{
  for (var i = array.length - 1; i > 0; i--) 
  {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
} 

function OutOfTime(lvl) //lvl arvo kulkee nyt funktiosta toiseen parametrinä, ei ole muuta väliä
{
    switch(parseInt(lvl))
    {
        case 1: sessionStorage.setItem("lvl1Score", lvl1Score);
        window.location.href = 'p2Info.html';
        break;
        case 2: sessionStorage.setItem("lvl2Score", lvl2Score);
        window.location.href = 'p3Info.html';
        break;
        case 3: sessionStorage.setItem("lvl3Score", lvl3Score);
        window.location.href = 'p4Info.html';
        break;
        case 4: sessionStorage.setItem("lvl4Score", lvl4Score);
        window.location.href = 'P5EndScreen.html';
        break;
        default: 
            alert("error in game: valid level not selected in out of time");
    }   

}
function Timer(lvl)  { //lvl arvo kulkee nyt funktiosta toiseen parametrinä, ei ole muuta väliä 
    var i = 0;
      if (i == 0) {
        i = 1;
        // hakee html tiedostosta elementin "timerBar"
        var elem = document.getElementById("timerBar");
        // Luodaan leveysmuuttuja
        var width = 100;
        // setInterval funktio joka toistaa loopissa Frame funktiota. 333 on millisekuntia, nopeus jolla funktio pyörii.
        var id = setInterval(Frame, 333);
        
        function Frame() {
          if (width == 50) {
            elem.style.backgroundColor = "#FFA500";
          }
          if (width == 25) {
            elem.style.backgroundColor = "#FF4500";
          }
          if (width <= 0) {
            clearInterval(id);
            i = 0;
            OutOfTime(lvl); //lvl arvo kulkee nyt funktiosta toiseen parametrinä, ei ole muuta väliä
          } else {
            width--;
            elem.style.width = width + "%";
          }
        }
      }
    }

function Score(lvl)
{
  var elem;
  var score;
  var elemHeight;

  if (lvl == 4) // tarkastetaan onko koosteen vuoro, tähän pitää lisätä neljäs
  {
    document.getElementById('finalScore').innerHTML += "Ensimmäisen vaiheen pisteet: " + sessionStorage.getItem("lvl1Score");  // muutetaan finalScore elementin tekstiä
    document.getElementById('finalScore2').innerHTML += "Toisen vaiheen pisteet: " + sessionStorage.getItem("lvl2Score");  
    document.getElementById('finalScore3').innerHTML += "Kolmannen vaiheen pisteet: " + sessionStorage.getItem("lvl3Score"); 
    document.getElementById('finalScore4').innerHTML += "Neljännen vaiheen pisteet: " + sessionStorage.getItem("lvl4Score"); 
    for (var i = 1; i <= 4; i++ ) // Tähän myös neljäs
    {
      elem = document.getElementById("scoreFinalFill" + i.toString()); // Haetaan elementti x
      score = 24 - sessionStorage.getItem("lvl" + i.toString() + "Score"); // Haetaan tulos x
      elemHeight = score.toString() + "px"; // muutetaan lopputulos tekstiksi

      elem.style.height = elemHeight; // asetetaan esim. scoreOneFill elementtiin tyylittelyt
      elem.style.width = "50px";
      elem.style.backgroundColor = "#ddd";
    }
  } else
  {
    switch(parseInt(lvl))
    {
        case 1: document.getElementById('scoreDisplay').innerHTML += "Ensimmäisen vaiheen pisteet: " + sessionStorage.getItem("lvl1Score");
        break;
        case 2: document.getElementById('scoreDisplay2').innerHTML += "Toisen vaiheen pisteet: " + sessionStorage.getItem("lvl2Score");   
        break;
        case 3: document.getElementById('scoreDisplay3').innerHTML += "Kolmannen vaiheen pisteet: " + sessionStorage.getItem("lvl3Score"); 
        break;
        case 4: document.getElementById('scoreDisplay4').innerHTML += "Neljännen vaiheen pisteet: " + sessionStorage.getItem("lvl4Score"); 
        break;
        default: 
            alert("error in game: valid level not selected in out of time");
    }
  
    elem = document.getElementById("scoreFill" + lvl.toString()); // Haetaan elementti x
    score = 24 - sessionStorage.getItem("lvl" + lvl.toString() + "Score"); // Haetaan tulos x
    elemHeight = score.toString() + "px"; // muutetaan lopputulos tekstiksi

    elem.style.height = elemHeight; // asetetaan esim. scoreOneFill elementtiin tyylittelyt
    elem.style.width = "50px";
    elem.style.backgroundColor = "#ddd";
  }
} 