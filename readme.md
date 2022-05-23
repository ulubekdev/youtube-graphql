<h1>Little YouTube GraphQL app with PostgreSQL</h1>

Mutation fields and arguments
    
    
    register (
        username: String!, 
        password: String, 
        image: Uplaod!
    ): AuthResponse!

    login (
        username: String!,
        password: String
    ): AuthResponse!

    with token {
        uploadVideo(
            title: String!
            video: Upload!
        ): VideoResponse!

        deleteVideo(
            videoId: ID!
        ): VideoResponse!

        changeVideo (
            videoId: ID!
            title: String!
        ): VideoResponse!
    }

Query fields and arguments


    videos(
        search: String!
        userId: ID!
        pagination: Pagination!
    ): [Video!]!                               [public]

    users(
        userId: ID!
        pagination: Pagination!
    ): [User!]!                                [public]

    user(
        userId: ID!
    ): User!

    myvideos(
        pagination: Pagination!
        search: String!
    ): [Video!]                                [private]


AuthResponse | VideoResponse


    status: Int!
    message: String!
    data: Video | User
    token: Token!
