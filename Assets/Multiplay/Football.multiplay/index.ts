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
            kickInfo.senderSessionId=  msg.sender.senderSessionId;

            kickInfo.lastPosition = new Vector3();
            kickInfo.lastPosition.x = msg.position.x;
            kickInfo.lastPosition.y = msg.position.y;
            kickInfo.lastPosition.z = msg.position.z; 
          
            kickInfo.velocity = new Vector3();
            kickInfo.velocity.x = msg.velocity.x;
            kickInfo.velocity.y = msg.velocity.y;
            kickInfo.velocity.z = msg.velocity.z; 
      
           
            
            this.state.ball.kickInfo = kickInfo;
            console.log(kickInfo.senderSessionId);
            console.log(kickInfo.lastPosition);
            console.log(kickInfo.velocity);
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