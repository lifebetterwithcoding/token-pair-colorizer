
import {TokenType} from './types';
export class Pair{
     readonly startPos:number;
     readonly endPos:number;
     readonly color:number;
     readonly type=TokenType;
     constructor(s:number,e:number,c:number,type:TokenType){
          this.startPos = s;
          this.endPos = e;
          this.color = c;
          this.type = TokenType;
     }
}