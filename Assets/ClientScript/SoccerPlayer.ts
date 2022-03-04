import { Collider, Color, Debug, Gizmos, Physics, Random, Time, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import SoccerBall from './SoccerBall';
import Game from './Game';
import VectorExtention from './VectorExtention';

export default class SoccerPlayer extends ZepetoScriptBehaviour {

    private kickRadius: number;
    private kickPower: number;
    private ball: SoccerBall; 
    private kickCoolTime: number;
    private kickRemainCoolTime: number;
    Awake() { 
        this.kickCoolTime = 0.5;
        this.kickRemainCoolTime = -1;
        this.kickRadius = 0.5; 
    }

    Update() {
        if (this.kickRemainCoolTime > 0)
            this.kickRemainCoolTime -= Time.deltaTime;
        let colliders: Collider[] = Physics.OverlapSphere(this.transform.position, this.kickRadius, 1 << 8);
        colliders.forEach(collider => { 
            if (!this.ball)
                this.ball = collider.gameObject.GetComponent<SoccerBall>();
            this.Kick();
        });
    }

    Kick() {
        if (this.ball && this.kickRemainCoolTime <= 0) {
            this.kickPower = Random.Range(7.0, 10.0);
            this.kickRemainCoolTime = this.kickCoolTime; 
            this.ball.rigidBody.velocity = Vector3.zero; 
            const dir: Vector3 = VectorExtention.Sub(this.ball.transform.position, this.transform.position);
            const normalizedDir = dir.normalized;  
            this.ball.AddPower(normalizedDir, this.kickPower);
            Game.Instance.SendKickBallEvent(this.ball.transform.position, this.ball.rigidBody.velocity);
            Debug.DrawRay(this.transform.position, VectorExtention.Mul(normalizedDir, 5), Color.red, 1); 
        }
    }
}