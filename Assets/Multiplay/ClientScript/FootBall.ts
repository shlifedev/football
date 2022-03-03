import { Rigidbody, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import VectorExtention from './VectorExtention';
export default class FootBall extends ZepetoScriptBehaviour {

    public rigidBody : Rigidbody;

    AddPower(dir : Vector3, power : number){
        this.rigidBody.velocity = VectorExtention.Add(this.rigidBody.velocity, VectorExtention.Mul(dir, power));
    } 

    public SyncNetwork(pos : Vector3, velocity : Vector3){ 

        console.log("sync pos : " + pos.x +"," + pos.y +"," + pos.z);
        console.log("sync velocity : " + velocity.x +"," + velocity.y +"," + velocity.z);
        
        this.transform.position = pos;
        this.rigidBody.velocity = velocity; 
    }
}