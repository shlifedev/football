import { Sandbox, SandboxOptions, SandboxPlayer } from "ZEPETO.Multiplay";
import { KickInfo, Player, Transform, Vector3 } from "ZEPETO.Multiplay.Schema";

export default class extends Sandbox {

    onCreate(options: SandboxOptions) {

        //플레이어 위치 변경
        this.onMessage("onChangedPlayerTransform", (client, message) => {
            const player = this.state.players.get(client.sessionId);

            const transform = new Transform();
            transform.position = new Vector3();
            transform.position.x = message.position.x;
            transform.position.y = message.position.y;
            transform.position.z = message.position.z;

            transform.rotation = new Vector3();
            transform.rotation.x = message.rotation.x;
            transform.rotation.y = message.rotation.y;
            transform.rotation.z = message.rotation.z;

            player.transform = transform;

            console.log('onChangedPlayerTransform' + transform.position)
        });

        //플레이어 상태 변경
        this.onMessage("onChangedState", (client, message) => {
            const player = this.state.players.get(client.sessionId);
            player.state = message.state;

        
        });

 


        this.onMessage("onKickBall", (client, msg) => { 

             
            const kickInfo = new KickInfo(); 

            const senderSessionId = msg.sender.senderSessionId;
            
            const lastPos = new Vector3();
            lastPos.x = msg.position.x;
            lastPos.y = msg.position.y;
            lastPos.z = msg.position.z; 
            const velocity = new Vector3();
            lastPos.x = msg.velocity.x;
            lastPos.y = msg.velocity.y;
            lastPos.z = msg.velocity.z; 
      
            kickInfo.senderSessionId= senderSessionId;
            kickInfo.lastPosition= lastPos;
            kickInfo.velocity = velocity; 
            
            console.log(msg.kickInfo);
            console.log('onKickBall!');
        });
    }

    async onJoin(client: SandboxPlayer) {
        const player = new Player();
        player.sessionId = client.sessionId;
        const transform = new Transform();
        player.transform = transform;

        if (client.hashCode)
            player.zepetoHash = client.hashCode;
        if (client.userId)
            player.zepetoHash = client.userId;


        console.log(`[OnJoin] ${client.sessionId}'s`)

        //플레이어 스테이트에 추가
        this.state.players.set(client.sessionId, player);
    }

    onLeave(client: SandboxPlayer, consented?: boolean) {
        this.state.players.delete(client.sessionId);
    }
}