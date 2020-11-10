import {TokenType, tokens} from './types'
import {Pair} from './Pair'

export class BracketManager{

     private allBrackets : Pair[];
     text : string;
     constructor(text:string){
          this.text=text;
          this.allBrackets = [];
     }
     getAllBrackets()
     {
          let bracketIndex = 0;
          let textIndex = 0;
          while ((bracketIndex = this.getFirstBracketIndex(textIndex)) != -1){
               textIndex = this.getClosingBracket(bracketIndex,0);
               console.log("bracketIndex",bracketIndex,"textIndex",textIndex);
          }
          return this.allBrackets;
     }
     private getFirstBracketIndex(index:number){
          let firstP = this.text.indexOf('(',index);
          let firstB = this.text.indexOf('[',index);
          let firstCB = this.text.indexOf('{',index);
          if (firstP == -1 && firstB == -1 && firstCB == -1) return -1;
          if (firstP == -1) firstP = Infinity;
          if (firstB == -1) firstB = Infinity;
          if (firstCB == -1) firstCB = Infinity;
          return Math.min(firstP,firstB,firstCB);
     }
     private getClosingBracket(openingBracketPos:number,color:number){
          let i=0;
          for(i=openingBracketPos+1;i<this.text.length;i++)
          {
               let ch = this.text.charAt(i);
               if(ch == '"'){
                    //avoid strings
                    i++;
                    while(i<this.text.length && (ch = this.text.charAt(i)) != '"')
                    {    
                         i++;
                    }
               }else if(ch == '('){
                    i = this.getClosingBracket(i,color+1);
               }else if(ch == '{'){
                    i = this.getClosingBracket(i,color+1);
               }else if(ch == '['){
                    i = this.getClosingBracket(i,color+1);
               }else if(ch == ')'){
                    this.allBrackets.push(new Pair(openingBracketPos,i,color,TokenType.Paratheses))
                    return i;
               }else if(ch == '}'){
                    this.allBrackets.push(new Pair(openingBracketPos,i,color,TokenType.CurlyBracket))
                    return i;
               }else if(ch == ']'){
                    this.allBrackets.push(new Pair(openingBracketPos,i,color,TokenType.Bracket))
                    return i;
               }
          }
          return i;
     }
}