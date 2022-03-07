// /*
//  auto completed by jetbrain rider, don't remove it!
//  author by shlifedev@gmail.com(https://github.com/shlifedev)
// */

import { Collider, GameObject, LayerMask, Quaternion, Vector3} from 'UnityEngine';
import { ZepetoCharacter } from 'ZEPETO.Character.Controller';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'; 
import SoccerBall from './SoccerBall';


/**
 * 플레이어나 공이 해당 컴포넌트에 부딪히면 이벤트 수신후 위치 재설정
 */
export default class FallDetector extends ZepetoScriptBehaviour { 
    public respawnPoint_Center : GameObject;
    OnTriggerStay(collider : Collider){
        console.log(collider.name +" falled! LyaerMask => " + LayerMask.LayerToName(collider.gameObject.layer));
        if(LayerMask.LayerToName(collider.gameObject.layer) === "Character"){ 
            let character : ZepetoCharacter = collider.GetComponent<ZepetoCharacter>(); 
                character.Teleport(this.respawnPoint_Center.transform.position, Quaternion.identity); 
                character.transform.position = this.respawnPoint_Center.transform.position;
        }
        else if(LayerMask.LayerToName(collider.gameObject.layer) === "Ball"){ 
            collider.transform.position = this.respawnPoint_Center.transform.position;
            let ball = collider.GetComponent<SoccerBall>();
            ball.rigidBody.velocity = new Vector3(0,0,0); 
        } 
    }
}