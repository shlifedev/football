// /*
//  auto completed by jetbrain rider, don't remove it!
//  author by shlifedev@gmail.com(https://github.com/shlifedev)
// */

import { CharacterState, SpawnInfo, ZepetoPlayers } from 'ZEPETO.Character.Controller';
import { Room, RoomData } from 'ZEPETO.Multiplay';
import { Ball, Player, State, Vector3 } from 'ZEPETO.Multiplay.Schema';
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { ZepetoWorldMultiplay } from 'ZEPETO.World';
import PlayerManager from './PlayerManager'
import SoccerPlayer from './SoccerPlayer';
import * as UnityEngine from "UnityEngine";
import FootBall from './FootBall';


export default class Game extends ZepetoScriptBehaviour {

    public footBall : FootBall;
    public multiplay: ZepetoWorldMultiplay;
    private room: Room;

    public blueTeamScore: int;
    public redTeamScore: int;

    public blueTeamScoreTextMesh: UnityEngine.TextMesh;
    public redTeamScoreTextMesh: UnityEngine.TextMesh;


    private static _instance: Game = null;


    
    public static get Instance(): Game {
        if (this._instance == null) {
            this._instance = UnityEngine.GameObject.FindObjectOfType<Game>();
        }


        return this._instance;
    }

 

    public AddGoalScore(blueTeam: boolean) {

        console.log('goal! red team score : ' + this.redTeamScore)
        console.log('goal! blue team score : ' + this.blueTeamScore)

        if (blueTeam) this.blueTeamScore += 1;
        else this.redTeamScore += 1;

        if (this.blueTeamScoreTextMesh)
            this.blueTeamScoreTextMesh.text = `${this.blueTeamScore}`;
        if (this.redTeamScoreTextMesh)
            this.redTeamScoreTextMesh.text = `${this.redTeamScore}`;


    }


    private ParseVector3(vector3: Vector3): UnityEngine.Vector3 {
        return new UnityEngine.Vector3
            (
                vector3.x,
                vector3.y,
                vector3.z
            );
    }

    //캐릭터 생성 
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



    private OnRemovePlayer(sessionId: string, player: Player) {
        console.log(`[OnRemove] players - sessionId : ${sessionId}`);
        ZepetoPlayers.instance.RemovePlayer(sessionId);
    }


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

    public SendKickBallEvent(lastPosition: UnityEngine.Vector3, velocity: UnityEngine.Vector3) {
        const data = new RoomData();
        console.log("send lastPosition: "+ lastPosition.x +","+ lastPosition.y +","+ lastPosition.z);
        console.log("send velocity: "+ velocity.x +","+ velocity.y +","+ velocity.z);
 
        const _senderSessionId = new RoomData();
        _senderSessionId.Add("senderSessionId", this.room.SessionId);
        data.Add("sender", _senderSessionId.GetObject());



        const pos = new RoomData();
        pos.Add("x", lastPosition.x);
        pos.Add("y", lastPosition.y);
        pos.Add("z", lastPosition.z);

        data.Add("position", pos.GetObject());

        const _velocity = new RoomData();
        _velocity.Add("x", velocity.x);
        _velocity.Add("y", velocity.y);
        _velocity.Add("z", velocity.z);

        data.Add("velocity", _velocity.GetObject());

        this.room.Send("onKickBall", data.GetObject());
    }
    private SendState(state: CharacterState) {
        const data = new RoomData();
        data.Add("state", state);
        this.room.Send("onChangedState", data.GetObject());
    }

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

    private OnStateChange(state: State, isFirst: boolean) {

        // 첫 OnStateChange 이벤트 수신 시, State 전체 스냅샷을 수신합니다.
        if (isFirst) {

            console.log("onstateChange")
            // [RoomState] 현재 Room에 존재하는 player 인스턴스 생성
            state.players.ForEach((sessionId: string, player: Player) => this.OnJoinPlayer(sessionId, player));

            // [RoomState] 이후 Room에 입장하는 player 인스턴스 생성
            state.players.OnAdd += (player: Player, sessionId: string) => this.OnJoinPlayer(sessionId, player);

            // [RoomState] 이후 Room에서 퇴장하는 player 인스턴스 제거
            state.players.OnRemove += (player: Player, sessionId: string) => this.OnRemovePlayer(sessionId, player);

            // [CharacterController] 내 (Local)player 인스턴스 생성이 완료된 후, 초기화
            ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
                console.log("OnAddedLocalPlayer!")
                const myPlayer = ZepetoPlayers.instance.LocalPlayer.zepetoPlayer;
                var characterGo = myPlayer.character.gameObject;
                characterGo.layer = UnityEngine.LayerMask.NameToLayer("Character");
                let soccerPlayer = characterGo.AddComponent<SoccerPlayer>();
                soccerPlayer.kickRadius = 1;

                myPlayer.character.OnChangedState.AddListener((cur, next) => {
                    this.SendState(next);
                });


                const ball: Ball = this.room.State.ball;
                ball.OnChange += (values) => { 
                    if(ball.kickInfo.senderSessionId === this.room.SessionId){
                        console.log("ignore");
                    }
                    else{
                        console.log("sync"); 
                        this.footBall.SyncNetwork(this.ParseVector3(ball.kickInfo.lastPosition), this.ParseVector3(ball.kickInfo.velocity));
                    } 
                }
            });




            // [CharacterController] 다른 player 인스턴스 생성이 완료된 후, 초기화
            ZepetoPlayers.instance.OnAddedPlayer.AddListener((sessionId: string) => {
                console.log("OnAddedPlayer!")
                const playerState: Player = this.room.State.players.get_Item(sessionId);

                // [RoomState] player 인스턴스의 state가 갱신될 때마다 호출됩니다.
                playerState.OnChange += (changedValues) => {
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

        this.footBall = UnityEngine.GameObject.FindObjectOfType<FootBall>();
        this.multiplay.RoomCreated += (room: Room) => {
            console.log("room created!");
            this.room = room;
        };

        this.multiplay.RoomJoined += (room: Room) => {
            console.log("room joined!");
            room.OnStateChange += this.OnStateChange;
        };

        this.StartCoroutine(this.SendMessageLoop(0.1));
    }

}