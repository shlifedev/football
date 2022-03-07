import { Collider, Color, Debug, Gizmos, Physics, Random, Time, Vector3 } from 'UnityEngine'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import SoccerBall from './SoccerBall';
import Game from './Game';
import VectorExtention from './VectorExtention';

export default class SoccerPlayer extends ZepetoScriptBehaviour {


    /**
     * 공을 찰 수 있는 범위
     */
    private kickRadius: number;


    /**
     * 공을 차는 힘 
     */
    private kickPower: number;

 
    private ball: SoccerBall; 


    /**
     * 공 재사용 대기시간
     */
    private kickCoolTime: number;
    private kickRemainCoolTime: number;


    Awake() { 
        this.kickCoolTime = 0.5;
        this.kickRemainCoolTime = -1;
        this.kickRadius = 0.5; 
    }

    Update() {
        //쿨타임 계산코드
        if (this.kickRemainCoolTime > 0)
            this.kickRemainCoolTime -= Time.deltaTime;

        //주변의 공을 찾고, 공을 찾은경우 Kick한다.
        let colliders: Collider[] = Physics.OverlapSphere(this.transform.position, this.kickRadius, 1 << 8);
        colliders.forEach(collider => { 
            if (!this.ball)
                this.ball = collider.gameObject.GetComponent<SoccerBall>();
            this.Kick();
        });
    }



    /**
     * 공을 차는 코드
     */
    Kick() {
        if (this.ball && this.kickRemainCoolTime <= 0) {
            
            // 차는 힘을 랜덤으로 설정
            this.kickPower = Random.Range(7.0, 10.0);

            // 쿨타임 적용
            this.kickRemainCoolTime = this.kickCoolTime;  
            
            // 공이 나아갈 방향 계산 
            const dir: Vector3 = VectorExtention.Sub(this.ball.transform.position, this.transform.position);
            const normalizedDir = dir.normalized;  
            
            // 공에 물리효과 적용
            this.ball.AddPower(normalizedDir, this.kickPower);

            // 다른 플레이어에게 공의 물리효과 동기화
            Game.Instance.SendKickBallEvent(this.ball.transform.position, this.ball.rigidBody.velocity);
            
            // 씬뷰 디버그용 코드
            Debug.DrawRay(this.transform.position, VectorExtention.Mul(normalizedDir, 5), Color.red, 1); 
        }
    }
}