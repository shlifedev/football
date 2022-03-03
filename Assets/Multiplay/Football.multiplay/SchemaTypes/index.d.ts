declare module "ZEPETO.Multiplay.Schema" {

	import { Schema, MapSchema, ArraySchema } from "@colyseus/schema"; 


	interface State extends Schema {
		players: MapSchema<Player>;
		ball: Ball;
		score_red: number;
		score_blue: number;
	}
	class Vector3 extends Schema {
		x: number;
		y: number;
		z: number;
	}
	class Transform extends Schema {
		position: Vector3;
		rotation: Vector3;
	}
	class KickInfo extends Schema {
		senderSessionId: string;
		lastPosition: Vector3;
		velocity: Vector3;
	}
	class Player extends Schema {
		sessionId: string;
		zepetoHash: string;
		zepetoUserId: string;
		transform: Transform;
		state: number;
	}
	class Ball extends Schema {
		kickInfo: KickInfo;
	}
}