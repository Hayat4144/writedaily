const generateNodeId = () => {
    return Math.random().toString().substring(0, 8);
};

export default generateNodeId;
