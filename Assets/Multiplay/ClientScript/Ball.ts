import { Rigidbody, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import ZMath from './ZMath';
export default class Ball extends ZepetoScriptBehaviour {

    public rigidBody : Rigidbody;

    AddPower(dir : Vector3, power : number){
        this.rigidBody.velocity = ZMath.Add(this.rigidBody.velocity, ZMath.Mul(dir, power));
    } 
}