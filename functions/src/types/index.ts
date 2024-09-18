export type GradedQuestions  = {
    [key: string]: TypedQuestion[];
}

export type TypedQuestion = {
    questionId: string
    pointsScored: number
}