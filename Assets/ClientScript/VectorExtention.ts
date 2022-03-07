import { Vector3 } from 'UnityEngine'



/**
 * TS에서는 vector a + vector b 가 안되는 것 같아 임시로 오퍼레이터를 대체할 익스텐션 작성
 * 추후 오퍼레이터 적용 가능시 수정한다.
 */
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