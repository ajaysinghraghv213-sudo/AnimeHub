import { Suspense } from "react";
import EditProfile from "@/app/Components/EditProfile";

const UpdateProfilePage = () => {
    return (
        <div>
            <Suspense fallback={null}>
                <EditProfile />
            </Suspense>
        </div>
    );
};

export default UpdateProfilePage;