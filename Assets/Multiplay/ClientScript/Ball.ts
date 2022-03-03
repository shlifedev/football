import { Rigidbody, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import VectorExtention from './VectorExtention';
export default class Ball extends ZepetoScriptBehaviour {

    public rigidBody : Rigidbody;

    AddPower(dir : Vector3, power : number){
        this.rigidBody.velocity = VectorExtention.Add(this.rigidBody.velocity, VectorExtention.Mul(dir, power));
    } 
}