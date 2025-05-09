
const Loading = () => {
    return (
        <div className="flex justify-center items-center h-screen bg-base-200 ">
            <div
                className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-orange-500"
            ></div>
        </div>
    );
};

export default Loading;