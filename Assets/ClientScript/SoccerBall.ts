import { Rigidbody, Vector3 } from 'UnityEngine'
import { UnityAction, UnityEvent } from 'UnityEngine.Events';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import VectorExtention from './VectorExtention';
export default class SoccerBall extends ZepetoScriptBehaviour {

    public rigidBody : Rigidbody; 


    /**
     * 공에 힘을 전달
     * @param dir 방향
     * @param power 힘
     */
    public AddPower(dir : Vector3, power : number){
        this.rigidBody.velocity = Vector3.zero;
        this.rigidBody.velocity = VectorExtention.Add(this.rigidBody.velocity, VectorExtention.Mul(dir, power));
    }  
    /**
     * 전달받은 위치/velocity에 맞게 공의 위치를 동기화 시킴
     * @param position 전달받은 공의 위치
     * @param velocity 공의 물리방향
     */
    public SyncPosition(position : Vector3, velocity : Vector3){ 
        this.rigidBody.MovePosition(position);
        this.rigidBody.velocity = velocity; 
    }   
}