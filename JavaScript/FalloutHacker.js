var inputStr = "";
var buttonElem = "LikenessEval";
var list = [];
var prevGuesses = {};
var base = 1;

function setMode(mode)
{
   if (mode == 0)
   {
      base = 1.2;
   }
   else if(mode == 1)
   {
      base = 2.5;
   }
}

function InputValues() 
{
    var inputVal = document.forms["myForm"]["Inputlist"].value;
    if (inputVal == "") {
        alert("Name must be filled out");
        return false;
    }
    else
    {
      list = [];
      prevGuesses = {};
      list = BuildList(inputVal)
      var guess = Guess();
    }
}

function BuildList(inputStr)
{
   var newList = inputStr.split(" ");
   return newList;
}

function Guess()
{
   clearButtons();

   // If we have options, add buttons, otherwise
   // let the user know we are done.
   if (list.length > 1)
   {
      var guess = "";
      var bestVal = 0;
      for (i = 0; i < list.length; i++)
      {
         var value = 0;
         for (j = 0; j < list[i].length; j++)
         {
            for (x = 0; x < list.length; x++)
            {
               if (list[i] === list[x])
               {
                  continue;
               }
               if (list[i][j] === list[x][j])
               {
                  value += 1;
               }
            }
         }
         if (value > bestVal)
         {
            bestVal = value;
            guess = list[i];
         }
      }
      // If a guess can't be established, set it to the first item
      // This usually only happens with 2 elements remaining with no likeness.
      if (guess === "")
      {
         guess = list[0];
      }
      document.getElementById("result").innerHTML = "Guess: " + guess;

      addBtn(guess);
      return guess;
   }
   else
   {
      document.getElementById("result").innerHTML = "Final guess: " + list[0];
   }
}

function processLikeness(guess, likeness)
{
   if (likeness === guess)
   {
      for (i = 0; i < list.length; i++)
      {
         if (list[i] === guess)
         {
            list.splice(i,1);
            Guess();
            return;
         }
      }
   }
   // add guess to list of prev guesses
   prevGuesses[guess] = likeness;

   var tmplist = [];
   for (i = 0; i < list.length; i++)
   {
      var nMatches = 0;
      // Check if the likeness of the current item is the same
      // as the previous guesses.
      for(key in prevGuesses){
         var prevGuessVal = prevGuesses[key];
         if (list[i] === key)
         {
            continue;
         }
         var value = 0;
         for (ltr = 0; ltr < list[i].length; ltr++)
         {
            if (list[i][ltr] === key[ltr])
            {
               value += 1;
            }
         }
         if (value == prevGuessVal)
         {
            nMatches += 1;
         }
      }
      var nPrevGuesses = Object.keys(prevGuesses).length;
      if (nMatches == nPrevGuesses)
      {
         tmplist.push(list[i]);
      }
   }
   list = tmplist;
   Guess();
}

function addBtn(guess)
{
   clearButtons();
   var guessIndex = 0;
   for (i=0; i<list.length; i++)
   {
      if (list[i] === guess) { guessIndex = i; }
   }

   var isGuess = 1;
   for (i=guessIndex; i<list.length; i++)
   {
      
      if (i === guessIndex && !isGuess) { continue; }
      var buttons = [list[i], 0, 1, 2, 3];

      // Add a new div for each row of buttons
      var newDiv = document.createElement("div"); 
      var likenessDiv = document.getElementById(buttonElem);
      likenessDiv.appendChild(newDiv);
      // add the newly created element and its content into the DOM 
      // var currentDiv = document.getElementById(buttonElem); 
      // document.body.insertBefore(newDiv, currentDiv); 

      // Add the buttons to the div for each element
      var factor = 20;
      for (j=0; j<buttons.length; j++)
      {
         var width = base * factor;
         var height = base * factor;
         if (j===0) 
         { 
           width += buttons[0].length * factor/2; 
         }
         var style = "width: " + width + "px; height:" + height + "px;";
         if (isGuess)
         {
            style += "; color: red; font-weight: bold;";
         }
         add('button', buttons[j], newDiv, buttons[0], style);
      }
      if(isGuess == 1)
      {
         isGuess = 0;
         i = -1;
      }
   }
}

// Function to remove all of the buttons already put in.
function clearButtons()
{
   var elem = document.getElementById(buttonElem); 
   while (elem.firstChild) 
   {
      elem.removeChild(elem.firstChild);
   }
}

// Add an element of a specified type to the 
// specified element. 
// Also set color to red if isGuess is true.
function add(type, guess, destElem, parent, style) 
{
   //Create an input type dynamically.
   var element = document.createElement("input");

   //Assign different attributes to the element.
   element.setAttribute("type", type);
   element.setAttribute("value", guess);
   element.setAttribute("name", ("%s_%s",parent,guess));
   element.setAttribute("style", style);
   element.setAttribute("onclick", "processLikeness(\"" + parent + "\",\"" + guess + "\");");
   element.onClick = function () { processLikeness(parent, likeness); };

   //Append the element in page (in span).
   destElem.appendChild(element);
}
