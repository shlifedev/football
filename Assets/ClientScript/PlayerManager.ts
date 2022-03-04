// /*
//  auto completed by jetbrain rider, don't remove it!
//  author by shlifedev@gmail.com(https://github.com/shlifedev)
// */
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'
import { SpawnInfo, ZepetoPlayers, LocalPlayer, ZepetoCharacter } from
    'ZEPETO.Character.Controller'
import { GameObject, UnityException } from 'UnityEngine';
import { UnityAction } from 'UnityEngine.Events';

export default class PlayerManager extends ZepetoScriptBehaviour {

    private static _instance: PlayerManager = null;


    public static get Instance(): PlayerManager {
        if (this._instance == null) {
            this._instance = GameObject.FindObjectOfType<PlayerManager>();
        }
        return this._instance;
    }


    // 생성 된 캐릭터
    // Created Local Player
    private _localPlayer: LocalPlayer = null;
    private _localCharacter: ZepetoCharacter = null;

 

    public get IsLocalPlayerExist(): bool {
        
        if (this._localPlayer !== null && this._localPlayer !== undefined) return true;
        else return false;
    }


    public GetLocalPlayer(): LocalPlayer {
        if (this.IsLocalPlayerExist === false)
            throw new UnityException("Local Player가 생성되어있지 않습니다. PlayerManager.Instance.CreateLocalPlayer() 실행했습니까?")

        return this._localPlayer;
    }


    public GetLocalCharacter(): ZepetoCharacter {
        if (this.IsLocalPlayerExist === false)
            throw new UnityException("Local Character 생성되어있지 않습니다. PlayerManager.Instance.CreateLocalPlayer() 실행했습니까?")

        return this._localCharacter;
    }

 


    public CreateLocalPlayer(zepetoId: string, onAddedLocalPlayer: UnityAction = null): void {
        ZepetoPlayers.instance.OnAddedLocalPlayer.AddListener(() => {
            this._localPlayer = ZepetoPlayers.instance.LocalPlayer;
            this._localCharacter = this._localPlayer.zepetoPlayer.character;

            if (onAddedLocalPlayer !== null || onAddedLocalPlayer !== undefined) {
                onAddedLocalPlayer();
            }
        });

        ZepetoPlayers.instance.CreatePlayerWithZepetoId("", zepetoId, new SpawnInfo(), true);

    }


}