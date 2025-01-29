import DisplayNumber from "../components/DisplayNumber";
import {connect} from 'react-redux';

export default connect(
    state => {
        return {
            number:state.number,  // number, test가 props로 넘어감
            test:"입니다."
        }
    }, 
    dispatch => {
        return {
          
        }
    }
)(DisplayNumber);





// import DisplayNumber from "../components/DisplayNumber";
// import { useState, useEffect } from "react";
// import store from "../store";

// export default function DisplayNumberCon(porps) {
//     const [number, setNumber] = useState(store.getState().number);

//     useEffect(() => {
//         // store가 변경될 때마다 setNumber가 실행되도록 subscribe설정
//         const unsubscribe = store.subscribe(() => {
//             setNumber(store.getState().number);
//         });

//         // 컴포넌트가 언마운트(삭제)될 때 subscribe 해제 -> 메모리 누수 방지
//         return () => unsubscribe();
//     }, []);

//     return (
//         <DisplayNumber number={number} unit={porps.unit}></DisplayNumber>
//     )
// }