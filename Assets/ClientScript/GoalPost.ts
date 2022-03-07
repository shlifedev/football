import { Collider, LayerMask, Vector3 } from 'UnityEngine'; 
import { ZepetoScriptBehaviour } from 'ZEPETO.Script' 
import Game from './Game';

export default class GoalPost extends ZepetoScriptBehaviour {



    /**
     * 블루팀 골대인경우 true
     */
    public isBlueTeamGoalPost : boolean; 
    public initializePos : Vector3;
   

    /**
     * 공이 골대에 들어온 경우를 감지하여 이벤트 처리
     */
    OnTriggerEnter(collider : Collider){
        if(LayerMask.LayerToName(collider.gameObject.layer) === "Ball"){ 
            collider.gameObject.transform.position = this.initializePos; 
            Game.Instance.AddGoalScore(this.isBlueTeamGoalPost);
        } 
    }

}