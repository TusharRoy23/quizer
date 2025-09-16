import Loader from "@/components/common/Loader";
import { LOADER_FOR } from "@/utils/enum";

export default function Loading() {
    return <Loader loaderFor={LOADER_FOR.QuizReview} />
}