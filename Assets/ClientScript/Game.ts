// /*
//  auto completed by jetbrain rider, don't remove it!
//  author by shlifedev@gmail.com(https://github.com/shlifedev)
// */

import { CharacterState, SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { Ball, Player, State, Vector3 } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World'; 
import SoccerPlayer from './SoccerPlayer';
import * as UnityEngine from "UnityEngine";
import SoccerBall from './SoccerBall';


export default class Game extends ZepetoScriptBehaviour {

    public soccerBall: SoccerBall;
    public multiplay: ZepetoWorldMultiplay;
    private room: Room;



    /**
     * 스코어, 및 텍스트 표시
     */
    public blueTeamScore: int;
    public redTeamScore: int; 
    public blueTeamScoreTextMesh: UnityEngine.TextMesh;
    public redTeamScoreTextMesh: UnityEngine.TextMesh;



    private static _instance: Game = null;



    /**
     * 싱글톤
     */
    public static get Instance(): Game {
        if (this._instance == null) {
            this._instance = UnityEngine.GameObject.FindObjectOfType<Game>();
        }


        return this._instance;
    }




    /**
     * 점수 획득 처리 
     */
    public AddGoalScore(blueTeam: boolean) { 
        if (blueTeam) this.blueTeamScore += 1;
        else this.redTeamScore += 1;

        if (this.blueTeamScoreTextMesh)
            this.blueTeamScoreTextMesh.text = `${this.blueTeamScore}`;
        if (this.redTeamScoreTextMesh)
            this.redTeamScoreTextMesh.text = `${this.redTeamScore}`; 
    }



    /**
     * 스키마 Vector3을 유니티 Vector3으로 변환
     */
    private ParseVector3(vector3: Vector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
            (
                vector3.x,
                vector3.y,
                vector3.z
            );
    }

    /**
     * 플레이어 입장콜백 
     */
    private OnJoinPlayer(sessionId: string, player: Player) {
        console.log(`[OnJoinPlayer] players - sessionId : ${sessionId}`);

        const spawnInfo = new SpawnInfo();
        const position = this.ParseVector3(player.transform.position);
        const rotation = this.ParseVector3(player.transform.rotation);
        spawnInfo.position = position;
        spawnInfo.rotation = UnityEngine.Quaternion.Euler(rotation);

        //캐릭터 생성
        const isLocal = this.room.SessionId === player.sessionId;
        ZepetoPlayers.instance.CreatePlayerWithUserId(sessionId, player.zepetoUserId, spawnInfo, isLocal);


    }

    /**
     * 플레이어 삭제 콜백
     */
    private OnRemovePlayer(sessionId: string, player: Player) {
        console.log(`[OnRemove] players - sessionId : ${sessionId}`);
        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }




    /**
     * tick마다 플레이어 위치를 동기화시키기 위한 코드
     */
    private * SendMessageLoop(tick: number) {
        while (true) {
            yield new UnityEngine.WaitForSeconds(tick);

            if (this.room != null && this.room.IsConnected) {
                const hasPlayer = ZepetoPlayers.instance.HasPlayer(this.room.SessionId);
                if (hasPlayer) {
                    const myPlayer = ZepetoPlayers.instance.GetPlayer(this.room.SessionId);
                    if (myPlayer.character.CurrentState != CharacterState.Idle)
                        this.SendTransform(myPlayer.character.transform);
                }
            }
        }
    }



    /**
     * 공의 위치/속도 동기화
     */
    public SendKickBallEvent(lastPosition: UnityEngine.Vector3, velocity: UnityEngine.Vector3) {
        const data = new RoomData();
        const _senderSessionId = new RoomData();
        _senderSessionId.Add("senderSessionId", this.room.SessionId); 
        data.Add("sender",_senderSessionId.GetObject());


        // 위치정보 추가
        const pos = new RoomData();
        pos.Add("x", lastPosition.x);
        pos.Add("y", lastPosition.y);
        pos.Add("z", lastPosition.z); 
        data.Add("position", pos.GetObject());


        // 속도정보 추가
        const _velocity = new RoomData();
        _velocity.Add("x", velocity.x);
        _velocity.Add("y", velocity.y);
        _velocity.Add("z", velocity.z); 
        data.Add("velocity", _velocity.GetObject());

        this.room.Send("onKickBall", data.GetObject());
    }


    
    /**
     * 캐릭터의 Character Controller  상태 동기화 
     */
    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }


 
    
    /**
     * 캐릭터 위치 동기화
     * @param transform 
     */
    private SendTransform(transform: UnityEngine.Transform) {
        const data = new RoomData();

        const pos = new RoomData();
        pos.Add("x", transform.localPosition.x);
        pos.Add("y", transform.localPosition.y);
        pos.Add("z", transform.localPosition.z);
        data.Add("position", pos.GetObject());

        const rot = new RoomData();
        rot.Add("x", transform.localEulerAngles.x);
        rot.Add("y", transform.localEulerAngles.y);
        rot.Add("z", transform.localEulerAngles.z);
        data.Add("rotation", rot.GetObject());
        this.room.Send("onChangedPlayerTransform", data.GetObject());
    }



    
    /**
     * State 변경시 콜백 수신
     */
    private OnStateChange(state: State, isFirst: boolean) {

        // 첫 OnStateChange 이벤트 수신 시, State 전체 스냅샷을 수신합니다.
        if (isFirst) {
            /* 기존 룸에 존재했던 플레이어들을 생성시키고, 이후 추가되는 플레이어들도 추가/삭제 작업함 */
            state.players.ForEach((sessionId: string, player: Player) => this.OnJoinPlayer(sessionId, player));
            state.players.OnAdd += (player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player);
            state.players.OnRemove += (player: Player, sessionId: string) => this.OnRemovePlayer(sessionId, player);


            // 첫 접속시 공 위치 동기화를 위해 호출
            const ball: Ball = this.room.State.ball;
            this.soccerBall.SyncPosition(this.ParseVector3(ball.kickInfo.lastPosition), this.ParseVector3(ball.kickInfo.velocity));



            // [CharacterController] 내 (Local)player 인스턴스 생성이 완료된 후, 초기화
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {

                // 플레이어 설정.. 
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                var characterGo = myPlayer.character.gameObject;
                characterGo.layer = UnityEngine.LayerMask.NameToLayer("Character");

                // 로컬 플레이어에게만 해당 컴포넌트가 붙게된다.
                let soccerPlayer = characterGo.AddComponent<SoccerPlayer>();


                // 캐릭터의 스테이트 변경시 이벤트를 등록한다.
                myPlayer.character.OnChangedState.AddListener((cur, next) => {
                    this.SendState(next);
                });


                const ball: Ball = this.room.State.ball;
                ball.OnChange += (values) => {
                    // 다른 사람이 공을 찬 경우에만 SyncPosition 함수를 호출한다. (본인이 찬 공은 네트워크 동기화 X)
                    if (ball.kickInfo.senderSessionId !== this.room.SessionId)
                        this.soccerBall.SyncPosition(this.ParseVector3(ball.kickInfo.lastPosition), this.ParseVector3(ball.kickInfo.velocity));
                }
            });




            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {

                const playerState: Player = this.room.State.players.get_Item(sessionId);
                playerState.OnChange += (changedValues) => {

                    // 플레이어 Transform 변경시 처리
                    const zepetoPlayer = ZepetoPlayers.instance.GetPlayer(sessionId);
                    if (zepetoPlayer.isLocalPlayer === false) {
                        const position = this.ParseVector3(playerState.transform.position);
                        zepetoPlayer.character.MoveToPosition(position);

                        if (playerState.state === CharacterState.JumpIdle || playerState.state === CharacterState.JumpMove)
                            zepetoPlayer.character.Jump();
                    }
                };
            });



        }
    }


    Start() {

        /* SoccerBall 인스턴스 캐싱 */
        this.soccerBall = UnityEngine.GameObject.FindObjectOfType<SoccerBall>();
       
       
         /* 콜백 및 메세지 등록 */
        this.multiplay.RoomCreated += (room: Room) => { 
            this.room = room;
        };

        this.multiplay.RoomJoined += (room: Room) => { 
            room.OnStateChange += this.OnStateChange;
        };

        this.StartCoroutine(this.SendMessageLoop(0.1));
    }

}



