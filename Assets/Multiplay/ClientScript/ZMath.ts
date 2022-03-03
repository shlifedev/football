import { Collider, Vector3 } from 'UnityEngine'
import { ZepetoCharacter } from 'ZEPETO.Character.Controller'
import { ZepetoScriptBehaviour } from 'ZEPETO.Script'



export default class VectorExtention{

    public static Add(vectorA : Vector3, vectorB : Vector3) : Vector3{
        const diffX = vectorA.x + vectorB.x;
        const diffY = vectorA.y + vectorB.y;
        const diffZ = vectorA.z + vectorB.z; 
        return new Vector3(diffX, diffY, diffZ);
    }
    public static Sub(vectorA : Vector3, vectorB : Vector3) : Vector3{
        const diffX = vectorA.x - vectorB.x;
        const diffY = vectorA.y - vectorB.y;
        const diffZ = vectorA.z - vectorB.z; 
        return new Vector3(diffX, diffY, diffZ);
    }
 
    public static Mul(vectorA : Vector3, value : number) : Vector3{
        const diffX = vectorA.x * value;
        const diffY = vectorA.y * value;
        const diffZ = vectorA.z * value;
        return new Vector3(diffX, diffY, diffZ);
    }


}