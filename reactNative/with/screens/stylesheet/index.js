import { StyleSheet } from "react-native";

const globalStyles =  StyleSheet.create({
    root:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    container:{
        flex:1,
        alignItems:"center",
        marginTop: 36
    },
    inputBox: {
        backgroundColor: "#C7B7FA",
        borderRadius: 20,
        width: "70%",
        height: 45,
        marginBottom: 20
      },
    TextInput: {
        height: 50,
        flex: 1,
        padding: 10,
        marginLeft: 20,
    }
});

export default globalStyles;