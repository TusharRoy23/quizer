import { ArrowRight } from "@/icons";
import StepLayout from "../layouts/StepLayout";
import { StepProps } from "@/types";
import Input from "../form/InputField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setUserInfo } from "@/store/reducers/stepSlice";

type UserInfoForm = {
    name: string;
    email: string;
};

function UserInfoData({ formData, onFormChange }: { formData: UserInfoForm, onFormChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
    return (
        <>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                <Input
                    type="text"
                    name="name"
                    onChange={onFormChange}
                    defaultValue={formData.name}
                    placeholder="Enter your name"
                />
            </div>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
                <Input
                    type="email"
                    name="email"
                    onChange={onFormChange}
                    defaultValue={formData.email}
                    placeholder="Enter your email"
                />
            </div>
        </>
    );
}

export default function UserInfo({ onNextStep, onPreviousStep }: StepProps) {
    const userInfo = useSelector((state: RootState) => state.steps.form.userInfo);
    const dispatch = useDispatch();
    const formData: UserInfoForm = {
        name: userInfo?.name || "",
        email: userInfo?.email || ""
    };
    const onFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        dispatch(setUserInfo({ ...formData, [name]: value }));
    }
    return (
        <>
            <StepLayout
                title={"User Information"}
                description={
                    <UserInfoData
                        formData={formData}
                        onFormChange={onFormChange}
                    />
                }
                btnLabel={"Select Department"}
                onNextStep={onNextStep}
                onPreviousStep={onPreviousStep}
                endIcon={<ArrowRight />}
            />
        </>
    );
}