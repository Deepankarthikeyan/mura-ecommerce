import HeaderOne from "@/components/header/Header";
import ShortService from "@/components/service/ShortService";
import CheckOutMain from "./CheckOutMain";
import FooterOne from "@/components/Footer";

export default function Home() {
    return (
        <div className="demo-one">
            <HeaderOne />


            <CheckOutMain />
            <ShortService />
            <FooterOne />
        </div>
    );
}
