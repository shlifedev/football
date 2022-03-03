import { Collider, LayerMask, Vector3 } from 'UnityEngine'; 
import { ZepetoScriptBehaviour } from 'ZEPETO.Script' 
import Game from './Game';

export default class GoalPost extends ZepetoScriptBehaviour {

    public isBlueTeamGoalPost : boolean;
    public initializePos : Vector3;
    OnTriggerEnter(collider : Collider){
        if(LayerMask.LayerToName(collider.gameObject.layer) === "Ball"){
            console.log("Goal! +1");
            collider.gameObject.transform.position = this.initializePos;
            
            Game.Instance.AddGoalScore(this.isBlueTeamGoalPost);
        } 
    }

}