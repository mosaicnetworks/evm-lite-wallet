import Actions from "./Actions";


interface ActionCreatorHandlers {
    init: () => { type: string },
    success: <T>(data: T) => {
        type: string,
        data: T,
    },
    failure: <T>(data: T) => {
        type: string,
        data: T
    }
}

const getActionCreatorHandlers = <T extends Actions>(object: T, prefix: string): ActionCreatorHandlers => {
    return {
        init: () => ({type: object.TYPES[`${prefix}_INIT`]}),
        success: <S>(data: S) => ({type: object.TYPES[`${prefix}_SUCCESS`], data}),
        failure: <F>(data: F) => ({type: object.TYPES[`${prefix}_FAILURE`], data}),
    }
};

export default getActionCreatorHandlers