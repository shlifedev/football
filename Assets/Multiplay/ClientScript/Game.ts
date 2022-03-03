// /*
//  auto completed by jetbrain rider, don't remove it!
//  author by shlifedev@gmail.com(https://github.com/shlifedev)
// */

import { GameObject, LayerMask, TextMesh, WaitForSeconds } from 'UnityEngine';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script' 
import PlayerManager from './PlayerManager'
import SoccerPlayer from './SoccerPlayer';

export default class Game extends ZepetoScriptBehaviour {
    public blueTeamScore : int;
    public redTeamScore : int;
    
    public blueTeamScoreTextMesh : TextMesh;
    public redTeamScoreTextMesh : TextMesh;
    

    private static _instance: Game = null;


    public static get Instance(): Game {
        if (this._instance == null) {
            this._instance = GameObject.FindObjectOfType<Game>();
        }
        return this._instance;
    }

    public AddGoalScore(blueTeam : boolean){

        console.log('goal! red team score : ' + this.redTeamScore)
        console.log('goal! blue team score : ' + this.blueTeamScore)
        
        if(blueTeam) this.blueTeamScore += 1;
        else this.redTeamScore += 1;

        if(this.blueTeamScoreTextMesh)
            this.blueTeamScoreTextMesh.text = `${this.blueTeamScore}`;
        if(this.redTeamScoreTextMesh)
            this.redTeamScoreTextMesh.text = `${this.redTeamScore}`;
        
    }


    Start() {    
        PlayerManager.Instance.CreateLocalPlayer("shlifedev", ()=>{
            var characterGo = PlayerManager.Instance.GetLocalCharacter().gameObject;
            characterGo.layer = LayerMask.NameToLayer("Character"); 
            
            
            let soccerPlayer = characterGo.AddComponent<SoccerPlayer>(); 
            soccerPlayer.kickRadius = 1;
            
        });
    }

}