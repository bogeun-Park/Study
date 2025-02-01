import AddNumber from "../components/AddNumber";
import { connect } from "react-redux";

export default connect(  // AddNumber컴포넌트를 감싸는 새로운 컴포넌트
    state => {
        return {
            
        }
    }, 
    dispatch => {
        return {
            onClick: function(size) {  // onClick가 props로 넘어감
                dispatch({type:'INCREMENT', size:size});
            }
        }
    }
)(AddNumber);




// import AddNumber from "../components/AddNumber";
// import store from "../store";

// // AddNumber의 컨테이너를 만들어서 컨테이너가 redux와 상호작용 하도록 하게 함
// // AddNumber는 부품으로써의 가치는 보존하고 redux와의 종속성은 제거함
// export default function AddNumberCon(props) {
//     return (
//         <AddNumber onClick={(size) => {
//             store.dispatch({type:'INCREMENT', size:size});
//         }}></AddNumber>
//     )
// }