// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {colors} from './colors';
import { Pair } from './Pair';
import {PairManager} from './PairManager';

export function activate(context: vscode.ExtensionContext) {
	let timeout: NodeJS.Timer | undefined = undefined;
     let activeEditor = vscode.window.activeTextEditor;
     let decorationsPerColor ;
     let decorationTypes :vscode.TextEditorDecorationType[]=[];
     function updateDecoration()
     {
          if(!activeEditor){
               return;
          }
          decorationsPerColor = initDecorationsMap();
          const text = activeEditor.document.getText();
          let pairManager = new PairManager(text);
          resetDecorations(decorationTypes);
          let allBrackets = pairManager.getAllBrackets();
          for(let tb of allBrackets){
               const decorations= decorationPerPair(activeEditor,tb);
               const color = getColor(tb.color);
               decorationsPerColor.get(color)?.push(decorations[0]);
               decorationsPerColor.get(color)?.push(decorations[1]);
          }
          setDecorations(activeEditor,decorationsPerColor,decorationTypes);
          vscode.window.showInformationMessage("done calculating brackets");
          
     }
     
     
     if(activeEditor)
     {
          triggerUpdate();
     }
     
     vscode.window.onDidChangeActiveTextEditor(editor =>{
          activeEditor = editor;
          if(activeEditor)
          {
               triggerUpdate();
          }
     },null,context.subscriptions);
     
     vscode.workspace.onDidChangeTextDocument(event=>{
          if(activeEditor && event.document == activeEditor.document){
               triggerUpdate();
          }
     },null,context.subscriptions);
     function decorationPerPair(activeEditor:vscode.TextEditor,pair:Pair):vscode.DecorationOptions[]
     {
          const openingBracketStart = activeEditor.document.positionAt(pair.startPos);
          const openingBracketEnd = activeEditor.document.positionAt(pair.startPos+1);
          const closingBracketStart = activeEditor.document.positionAt(pair.endPos);
          const closingBracketEnd = activeEditor.document.positionAt(pair.endPos+1);
          let d1={
                    range : new vscode.Range(openingBracketStart,openingBracketEnd),
          };    
          let d2={
                    range : new vscode.Range(closingBracketStart,closingBracketEnd),
          };
          console.log("d1 range :",d1.range.start.character,",",d1.range.end.character);
          console.log("d2 range :",d2.range.start.character,",",d2.range.end.character);
          return [d1,d2];
     }
     function getTextEditorDecorationType(color:string,decorationTypes:vscode.TextEditorDecorationType[])
     {
          let dt = vscode.window.createTextEditorDecorationType({
               color:color,
          });
          decorationTypes.push(dt)
          return dt;
     }

     function initDecorationsMap()
     {
          const map = new Map<string,vscode.DecorationOptions[]>(); 
          for(let color of colors)
          {
               map.set(color,[]);
          }
          return map;
     }
     function getColor(i:number)
     {
          const index =  i % colors.length;
          return colors[index];
     }
     function triggerUpdate()
     {
          if(timeout){
               clearTimeout(timeout)
               timeout = undefined;
          }
          timeout = setTimeout(updateDecoration, 500);
     }
     function setDecorations(activeEditor:vscode.TextEditor,map:Map<string,vscode.DecorationOptions[]>,decorationTypes:vscode.TextEditorDecorationType[])
     {
          if(!activeEditor) return;
          map.forEach((v,k)=>{
               activeEditor.setDecorations(getTextEditorDecorationType(k,decorationTypes),v);
          });
     }
     function resetDecorations(decorationTypes:vscode.TextEditorDecorationType[])
     {
          for(let st of decorationTypes)
          {
               st.dispose()
          }
          decorationTypes =[];
     }
}

// this method is called when your extension is deactivated
export function deactivate() {}
