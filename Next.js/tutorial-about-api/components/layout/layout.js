import NavBar from "./navBar";


export default function Layout({ children }) {
    return (
        <div>
            <NavBar />
            {children}
        </div>
    );
}