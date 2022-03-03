import { Collider, Color, Debug, Gizmos, Physics, Time, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import Ball from './Ball';
import VectorExtention from './VectorExtention';

export default class SoccerPlayer extends ZepetoScriptBehaviour {

    public kickRadius: number;
    public kickPower: number;
    public ball: Ball; 

    public kickCoolTime: number;
    public kickRemainCoolTime : number;
    Awake(){
        this.kickCoolTime = 0.75;
        this.kickPower = 1;

    }
    Update() {
        if(this.kickRemainCoolTime > 0) 
            this.kickRemainCoolTime -= Time.deltaTime; 
       let colliders: Collider[] = Physics.OverlapSphere(this.transform.position, this.kickRadius, 1 << 8);
        colliders.forEach(collider => {
            console.log(collider.name);
            if(!this.ball)
                this.ball = collider.gameObject.GetComponent<Ball>(); 
            this.Dribble(); 
        });
    }

    Dribble() {
        if (this.ball /*&& this.kickRemainCoolTime <= 0*/) {
            this.kickRemainCoolTime = this.kickCoolTime;
            const dir : Vector3 = VectorExtention.Sub(this.ball.transform.position, this.transform.position); 
            const normalizedDir = dir.normalized; 
            this.ball.AddPower(normalizedDir, this.kickPower);
            Debug.DrawRay(this.transform.position, VectorExtention.Mul(normalizedDir, 5), Color.red, 1);
        } 
    } 
}