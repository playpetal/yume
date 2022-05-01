/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * The `DateTime` custom scalar type represents a point in time.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * The `DateTime` custom scalar type represents a point in time.
     */
    DateTime<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
}

export interface NexusGenEnums {
  Flag: "DEVELOPER" | "PUBLIC_SUPPORTER" | "RELEASE_MANAGER"
  Gender: "FEMALE" | "MALE" | "NONBINARY"
  GroupGender: "COED" | "FEMALE" | "MALE"
  InventoryOrder: "ASC" | "DESC"
  InventorySort: "CHARACTER" | "CODE" | "GROUP" | "ISSUE" | "STAGE" | "SUBGROUP"
  LeaderboardType: "GUESS_THE_IDOLxCARD" | "GUESS_THE_IDOLxLILY" | "GUESS_THE_IDOLxPETAL" | "GUESS_THE_IDOLxTIME" | "GUESS_THE_SONGxCARD" | "GUESS_THE_SONGxLILY" | "GUESS_THE_SONGxPETAL" | "GUESS_THE_SONGxTIME" | "PUBLIC_SUPPORTER"
  MinigameComparison: "EQUAL" | "GREATER" | "LESS"
  MinigameState: "CANCELLED" | "COMPLETED" | "FAILED" | "PENDING" | "PLAYING"
  MinigameType: "GTS" | "GUESS_CHARACTER" | "GUESS_THE_GROUP" | "GUESS_THE_IDOL" | "GUESS_THE_SONG" | "WORDS"
  ProductType: "ALPHA_TITLE" | "BETA_TITLE" | "PAID_CURRENCY" | "SIGMA_TITLE"
  Quality: "BLOOM" | "BUD" | "FLOWER" | "SEED" | "SPROUT"
  Reward: "CARD" | "LILY" | "PETAL"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Account: { // root type
    activeTitleId?: number | null; // Int
    bio?: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    currency: number; // Int!
    discordId: string; // String!
    flags: number; // Int!
    id: number; // Int!
    premiumCurrency: number; // Int!
    username: string; // String!
  }
  AccountStats: { // root type
    cardCount: number; // Int!
    rollCount: number; // Int!
  }
  Alias: { // root type
    alias: string; // String!
    groupId: number; // Int!
    id: number; // Int!
  }
  Announcement: { // root type
    announcement: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
  }
  Bias: { // root type
    accountId: number; // Int!
    groupId: number; // Int!
  }
  Card: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    hasFrame: boolean; // Boolean!
    id: number; // Int!
    issue?: number | null; // Int
    ownerId?: number | null; // Int
    prefabId: number; // Int!
    quality: NexusGenEnums['Quality']; // Quality!
    tagId?: number | null; // Int
    tint: number; // Int!
  }
  CardPrefab: { // root type
    characterId: number; // Int!
    groupId?: number | null; // Int
    id: number; // Int!
    maxCards: number; // Int!
    rarity: number; // Int!
    releaseId: number; // Int!
    subgroupId?: number | null; // Int
  }
  Character: { // root type
    birthday?: NexusGenScalars['DateTime'] | null; // DateTime
    gender?: NexusGenEnums['Gender'] | null; // Gender
    id: number; // Int!
    name: string; // String!
  }
  Group: { // root type
    creation?: NexusGenScalars['DateTime'] | null; // DateTime
    gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
    id: number; // Int!
    name: string; // String!
  }
  GuessTheIdol: { // root type
    accountId: number; // Int!
    attempts: NexusGenRootTypes['GuessTheIdolCharacter'][]; // [GuessTheIdolCharacter!]!
    channelId?: string | null; // String
    character?: NexusGenRootTypes['Character'] | null; // Character
    elapsed?: number | null; // Int
    group?: string | null; // String
    guildId?: string | null; // String
    maxAttempts: number; // Int!
    messageId?: string | null; // String
    startedAt: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['MinigameState']; // MinigameState!
    timeLimit: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
  }
  GuessTheIdolCharacter: { // root type
    birthDate: NexusGenEnums['MinigameComparison']; // MinigameComparison!
    birthday?: NexusGenScalars['DateTime'] | null; // DateTime
    gender?: NexusGenEnums['Gender'] | null; // Gender
    isGender: boolean; // Boolean!
    name: string; // String!
    nameLength: NexusGenEnums['MinigameComparison']; // MinigameComparison!
  }
  GuessTheSong: { // root type
    accountId: number; // Int!
    attempts: NexusGenRootTypes['MinigameSong'][]; // [MinigameSong!]!
    channelId?: string | null; // String
    elapsed?: number | null; // Int
    guildId?: string | null; // String
    maxAttempts: number; // Int!
    messageId?: string | null; // String
    song?: NexusGenRootTypes['MinigameSong'] | null; // MinigameSong
    startedAt: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['MinigameState']; // MinigameState!
    timeLimit: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
    video?: string | null; // String
  }
  InventoryPage: { // root type
    cards: number; // Int!
    max: number; // Int!
  }
  Leaderboard: { // root type
    accountId: number; // Int!
    value: number; // Float!
  }
  MinigameReward: { // root type
    account: NexusGenRootTypes['Account']; // Account!
    card?: NexusGenRootTypes['Card'] | null; // Card
  }
  MinigameSong: { // root type
    group?: string | null; // String
    soloist?: string | null; // String
    title: string; // String!
  }
  MinigameStats: { // root type
    accountId: number; // Int!
    totalAttempts: number; // Int!
    totalCards: number; // Int!
    totalCurrency: number; // Int!
    totalGames: number; // Int!
    totalPremiumCurrency: number; // Int!
    totalTime: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
  }
  Mutation: {};
  Payment: { // root type
    accountId: number; // Int!
    cost: number; // Int!
    id: number; // Int!
    paymentId: string; // String!
    productId: number; // Int!
    success: boolean; // Boolean!
    url: string; // String!
  }
  Product: { // root type
    available: boolean; // Boolean!
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
    type?: NexusGenEnums['ProductType'] | null; // ProductType
  }
  Query: {};
  Release: { // root type
    droppable: boolean; // Boolean!
    id: number; // Int!
  }
  Song: { // root type
    groupId?: number | null; // Int
    id: number; // Int!
    releaseId: number; // Int!
    soloistId?: number | null; // Int
    title: string; // String!
  }
  Subgroup: { // root type
    creation?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
  }
  Tag: { // root type
    accountId: number; // Int!
    emoji: string; // String!
    id: number; // Int!
    tag: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Title: { // root type
    description?: string | null; // String
    id: number; // Int!
    title: string; // String!
  }
  TitleInventory: { // root type
    accountId: number; // Int!
    id: number; // Int!
    titleId: number; // Int!
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Account: { // field return type
    activeTitleId: number | null; // Int
    bio: string | null; // String
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    currency: number; // Int!
    discordId: string; // String!
    flags: number; // Int!
    id: number; // Int!
    minigameStats: NexusGenRootTypes['MinigameStats'] | null; // MinigameStats
    premiumCurrency: number; // Int!
    stats: NexusGenRootTypes['AccountStats'] | null; // AccountStats
    supporterTime: number | null; // Float
    tags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    title: NexusGenRootTypes['Title'] | null; // Title
    username: string; // String!
  }
  AccountStats: { // field return type
    cardCount: number; // Int!
    rollCount: number; // Int!
  }
  Alias: { // field return type
    alias: string; // String!
    group: NexusGenRootTypes['Group']; // Group!
    groupId: number; // Int!
    id: number; // Int!
  }
  Announcement: { // field return type
    announcement: string; // String!
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
  }
  Bias: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    group: NexusGenRootTypes['Group']; // Group!
    groupId: number; // Int!
  }
  Card: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    hasFrame: boolean; // Boolean!
    id: number; // Int!
    issue: number | null; // Int
    owner: NexusGenRootTypes['Account'] | null; // Account
    ownerId: number | null; // Int
    prefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    prefabId: number; // Int!
    quality: NexusGenEnums['Quality']; // Quality!
    tag: NexusGenRootTypes['Tag'] | null; // Tag
    tagId: number | null; // Int
    tint: number; // Int!
  }
  CardPrefab: { // field return type
    character: NexusGenRootTypes['Character']; // Character!
    characterId: number; // Int!
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: number | null; // Int
    id: number; // Int!
    maxCards: number; // Int!
    rarity: number; // Int!
    release: NexusGenRootTypes['Release']; // Release!
    releaseId: number; // Int!
    subgroup: NexusGenRootTypes['Subgroup'] | null; // Subgroup
    subgroupId: number | null; // Int
  }
  Character: { // field return type
    birthday: NexusGenScalars['DateTime'] | null; // DateTime
    gender: NexusGenEnums['Gender'] | null; // Gender
    id: number; // Int!
    name: string; // String!
  }
  Group: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    gender: NexusGenEnums['GroupGender'] | null; // GroupGender
    id: number; // Int!
    name: string; // String!
  }
  GuessTheIdol: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    attempts: NexusGenRootTypes['GuessTheIdolCharacter'][]; // [GuessTheIdolCharacter!]!
    channelId: string | null; // String
    character: NexusGenRootTypes['Character'] | null; // Character
    elapsed: number | null; // Int
    group: string | null; // String
    guildId: string | null; // String
    maxAttempts: number; // Int!
    messageId: string | null; // String
    startedAt: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['MinigameState']; // MinigameState!
    timeLimit: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
  }
  GuessTheIdolCharacter: { // field return type
    birthDate: NexusGenEnums['MinigameComparison']; // MinigameComparison!
    birthday: NexusGenScalars['DateTime'] | null; // DateTime
    gender: NexusGenEnums['Gender'] | null; // Gender
    isGender: boolean; // Boolean!
    name: string; // String!
    nameLength: NexusGenEnums['MinigameComparison']; // MinigameComparison!
  }
  GuessTheSong: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    attempts: NexusGenRootTypes['MinigameSong'][]; // [MinigameSong!]!
    channelId: string | null; // String
    elapsed: number | null; // Int
    guildId: string | null; // String
    maxAttempts: number; // Int!
    messageId: string | null; // String
    song: NexusGenRootTypes['MinigameSong'] | null; // MinigameSong
    startedAt: NexusGenScalars['DateTime']; // DateTime!
    state: NexusGenEnums['MinigameState']; // MinigameState!
    timeLimit: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
    video: string | null; // String
  }
  InventoryPage: { // field return type
    cards: number; // Int!
    max: number; // Int!
  }
  Leaderboard: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    value: number; // Float!
  }
  MinigameReward: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    card: NexusGenRootTypes['Card'] | null; // Card
  }
  MinigameSong: { // field return type
    group: string | null; // String
    soloist: string | null; // String
    title: string; // String!
  }
  MinigameStats: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    totalAttempts: number; // Int!
    totalCards: number; // Int!
    totalCurrency: number; // Int!
    totalGames: number; // Int!
    totalPremiumCurrency: number; // Int!
    totalTime: number; // Int!
    type: NexusGenEnums['MinigameType']; // MinigameType!
  }
  Mutation: { // field return type
    addBias: NexusGenRootTypes['Bias']; // Bias!
    answerGuessTheIdol: NexusGenRootTypes['GuessTheIdol']; // GuessTheIdol!
    answerGuessTheSong: NexusGenRootTypes['GuessTheSong']; // GuessTheSong!
    boost: boolean; // Boolean!
    burnCard: number; // Int!
    cancelMinigame: boolean; // Boolean!
    changeCardColor: NexusGenRootTypes['Card']; // Card!
    completeMinigame: NexusGenRootTypes['MinigameReward']; // MinigameReward!
    completeTransaction: boolean; // Boolean!
    createAccount: NexusGenRootTypes['Account']; // Account!
    createAlias: NexusGenRootTypes['Alias']; // Alias!
    createCharacter: NexusGenRootTypes['Character']; // Character!
    createGroup: NexusGenRootTypes['Group']; // Group!
    createPrefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    createRelease: NexusGenRootTypes['Release']; // Release!
    createSong: NexusGenRootTypes['Song']; // Song!
    createSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
    createTag: NexusGenRootTypes['Tag']; // Tag!
    createTitle: NexusGenRootTypes['Title']; // Title!
    deleteAlias: number; // Int!
    deleteCharacter: number; // Int!
    deleteGroup: number; // Int!
    deleteSong: number; // Int!
    deleteSubgroup: number; // Int!
    deleteTag: NexusGenRootTypes['Tag']; // Tag!
    editSong: NexusGenRootTypes['Song']; // Song!
    editTag: NexusGenRootTypes['Tag']; // Tag!
    gift: boolean; // Boolean!
    grantAllTitle: number; // Int!
    grantTitle: NexusGenRootTypes['TitleInventory']; // TitleInventory!
    newTransaction: NexusGenRootTypes['Payment']; // Payment!
    removeBias: NexusGenRootTypes['Bias']; // Bias!
    revokeAllTitle: number; // Int!
    revokeTitle: number; // Int!
    rollCards: NexusGenRootTypes['Card'][]; // [Card!]!
    setBio: NexusGenRootTypes['Account']; // Account!
    setFrame: NexusGenRootTypes['Card']; // Card!
    setUserTitle: NexusGenRootTypes['Account']; // Account!
    startGuessTheIdol: NexusGenRootTypes['GuessTheIdol']; // GuessTheIdol!
    startGuessTheSong: NexusGenRootTypes['GuessTheSong']; // GuessTheSong!
    tagCard: NexusGenRootTypes['Card']; // Card!
    toggleFlag: NexusGenRootTypes['Account']; // Account!
    togglePublicSupporter: NexusGenRootTypes['Account']; // Account!
    updateAlias: NexusGenRootTypes['Alias']; // Alias!
    updateCharacter: NexusGenRootTypes['Character']; // Character!
    updateGroup: NexusGenRootTypes['Group']; // Group!
    updateMinigameMessage: boolean; // Boolean!
    updatePrefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    updateRelease: NexusGenRootTypes['Release']; // Release!
    updateSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
    upgradeCard: NexusGenRootTypes['Card']; // Card!
  }
  Payment: { // field return type
    accountId: number; // Int!
    cost: number; // Int!
    id: number; // Int!
    paymentId: string; // String!
    productId: number; // Int!
    success: boolean; // Boolean!
    url: string; // String!
  }
  Product: { // field return type
    available: boolean; // Boolean!
    id: number; // Int!
    name: string; // String!
    price: number; // Int!
    type: NexusGenEnums['ProductType'] | null; // ProductType
  }
  Query: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    canClaimPremiumRewards: number; // Int!
    canClaimRewards: number; // Int!
    getAnnouncements: NexusGenRootTypes['Announcement'][]; // [Announcement!]!
    getBiases: NexusGenRootTypes['Bias'][]; // [Bias!]!
    getCard: NexusGenRootTypes['Card'] | null; // Card
    getCharacter: NexusGenRootTypes['Character'] | null; // Character
    getGroup: NexusGenRootTypes['Group'] | null; // Group
    getGuessTheIdol: NexusGenRootTypes['GuessTheIdol'] | null; // GuessTheIdol
    getGuessTheSong: NexusGenRootTypes['GuessTheSong'] | null; // GuessTheSong
    getLeaderboard: NexusGenRootTypes['Leaderboard'][]; // [Leaderboard!]!
    getSubgroup: NexusGenRootTypes['Subgroup'] | null; // Subgroup
    getTag: NexusGenRootTypes['Tag'] | null; // Tag
    getUserTitle: NexusGenRootTypes['TitleInventory'] | null; // TitleInventory
    inventory: NexusGenRootTypes['Card'][]; // [Card!]!
    inventoryPage: NexusGenRootTypes['InventoryPage']; // InventoryPage!
    isEmoji: boolean; // Boolean!
    isWordValid: boolean; // Boolean!
    lastRelease: NexusGenRootTypes['Release'] | null; // Release
    payment: NexusGenRootTypes['Payment'] | null; // Payment
    prefab: NexusGenRootTypes['CardPrefab'] | null; // CardPrefab
    products: NexusGenRootTypes['Product'][]; // [Product!]!
    reachedPurchaseLimit: boolean; // Boolean!
    release: NexusGenRootTypes['Release'] | null; // Release
    searchCards: NexusGenRootTypes['Card'][]; // [Card!]!
    searchCharacters: NexusGenRootTypes['Character'][]; // [Character!]!
    searchGroups: NexusGenRootTypes['Group'][]; // [Group!]!
    searchPrefabs: NexusGenRootTypes['CardPrefab'][]; // [CardPrefab!]!
    searchSubgroups: NexusGenRootTypes['Subgroup'][]; // [Subgroup!]!
    searchTags: NexusGenRootTypes['Tag'][]; // [Tag!]!
    searchTitles: NexusGenRootTypes['Title'][]; // [Title!]!
    title: NexusGenRootTypes['Title'] | null; // Title
    user: NexusGenRootTypes['Account'] | null; // Account
    userTitles: NexusGenRootTypes['TitleInventory'][]; // [TitleInventory!]!
    word: string; // String!
  }
  Release: { // field return type
    cards: NexusGenRootTypes['CardPrefab'][]; // [CardPrefab!]!
    droppable: boolean; // Boolean!
    id: number; // Int!
  }
  Song: { // field return type
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: number | null; // Int
    id: number; // Int!
    release: NexusGenRootTypes['Release']; // Release!
    releaseId: number; // Int!
    soloist: NexusGenRootTypes['Character'] | null; // Character
    soloistId: number | null; // Int
    title: string; // String!
  }
  Subgroup: { // field return type
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
  }
  Tag: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    cardCount: number; // Int!
    emoji: string; // String!
    id: number; // Int!
    tag: string; // String!
    updatedAt: NexusGenScalars['DateTime']; // DateTime!
  }
  Title: { // field return type
    description: string | null; // String
    id: number; // Int!
    inventory: NexusGenRootTypes['TitleInventory'][]; // [TitleInventory!]!
    ownedCount: number; // Int!
    title: string; // String!
  }
  TitleInventory: { // field return type
    account: NexusGenRootTypes['Account']; // Account!
    accountId: number; // Int!
    id: number; // Int!
    title: NexusGenRootTypes['Title']; // Title!
    titleId: number; // Int!
  }
}

export interface NexusGenFieldTypeNames {
  Account: { // field return type name
    activeTitleId: 'Int'
    bio: 'String'
    createdAt: 'DateTime'
    currency: 'Int'
    discordId: 'String'
    flags: 'Int'
    id: 'Int'
    minigameStats: 'MinigameStats'
    premiumCurrency: 'Int'
    stats: 'AccountStats'
    supporterTime: 'Float'
    tags: 'Tag'
    title: 'Title'
    username: 'String'
  }
  AccountStats: { // field return type name
    cardCount: 'Int'
    rollCount: 'Int'
  }
  Alias: { // field return type name
    alias: 'String'
    group: 'Group'
    groupId: 'Int'
    id: 'Int'
  }
  Announcement: { // field return type name
    announcement: 'String'
    createdAt: 'DateTime'
    id: 'Int'
  }
  Bias: { // field return type name
    account: 'Account'
    accountId: 'Int'
    group: 'Group'
    groupId: 'Int'
  }
  Card: { // field return type name
    createdAt: 'DateTime'
    hasFrame: 'Boolean'
    id: 'Int'
    issue: 'Int'
    owner: 'Account'
    ownerId: 'Int'
    prefab: 'CardPrefab'
    prefabId: 'Int'
    quality: 'Quality'
    tag: 'Tag'
    tagId: 'Int'
    tint: 'Int'
  }
  CardPrefab: { // field return type name
    character: 'Character'
    characterId: 'Int'
    group: 'Group'
    groupId: 'Int'
    id: 'Int'
    maxCards: 'Int'
    rarity: 'Int'
    release: 'Release'
    releaseId: 'Int'
    subgroup: 'Subgroup'
    subgroupId: 'Int'
  }
  Character: { // field return type name
    birthday: 'DateTime'
    gender: 'Gender'
    id: 'Int'
    name: 'String'
  }
  Group: { // field return type name
    aliases: 'Alias'
    creation: 'DateTime'
    gender: 'GroupGender'
    id: 'Int'
    name: 'String'
  }
  GuessTheIdol: { // field return type name
    account: 'Account'
    accountId: 'Int'
    attempts: 'GuessTheIdolCharacter'
    channelId: 'String'
    character: 'Character'
    elapsed: 'Int'
    group: 'String'
    guildId: 'String'
    maxAttempts: 'Int'
    messageId: 'String'
    startedAt: 'DateTime'
    state: 'MinigameState'
    timeLimit: 'Int'
    type: 'MinigameType'
  }
  GuessTheIdolCharacter: { // field return type name
    birthDate: 'MinigameComparison'
    birthday: 'DateTime'
    gender: 'Gender'
    isGender: 'Boolean'
    name: 'String'
    nameLength: 'MinigameComparison'
  }
  GuessTheSong: { // field return type name
    account: 'Account'
    accountId: 'Int'
    attempts: 'MinigameSong'
    channelId: 'String'
    elapsed: 'Int'
    guildId: 'String'
    maxAttempts: 'Int'
    messageId: 'String'
    song: 'MinigameSong'
    startedAt: 'DateTime'
    state: 'MinigameState'
    timeLimit: 'Int'
    type: 'MinigameType'
    video: 'String'
  }
  InventoryPage: { // field return type name
    cards: 'Int'
    max: 'Int'
  }
  Leaderboard: { // field return type name
    account: 'Account'
    accountId: 'Int'
    value: 'Float'
  }
  MinigameReward: { // field return type name
    account: 'Account'
    card: 'Card'
  }
  MinigameSong: { // field return type name
    group: 'String'
    soloist: 'String'
    title: 'String'
  }
  MinigameStats: { // field return type name
    account: 'Account'
    accountId: 'Int'
    totalAttempts: 'Int'
    totalCards: 'Int'
    totalCurrency: 'Int'
    totalGames: 'Int'
    totalPremiumCurrency: 'Int'
    totalTime: 'Int'
    type: 'MinigameType'
  }
  Mutation: { // field return type name
    addBias: 'Bias'
    answerGuessTheIdol: 'GuessTheIdol'
    answerGuessTheSong: 'GuessTheSong'
    boost: 'Boolean'
    burnCard: 'Int'
    cancelMinigame: 'Boolean'
    changeCardColor: 'Card'
    completeMinigame: 'MinigameReward'
    completeTransaction: 'Boolean'
    createAccount: 'Account'
    createAlias: 'Alias'
    createCharacter: 'Character'
    createGroup: 'Group'
    createPrefab: 'CardPrefab'
    createRelease: 'Release'
    createSong: 'Song'
    createSubgroup: 'Subgroup'
    createTag: 'Tag'
    createTitle: 'Title'
    deleteAlias: 'Int'
    deleteCharacter: 'Int'
    deleteGroup: 'Int'
    deleteSong: 'Int'
    deleteSubgroup: 'Int'
    deleteTag: 'Tag'
    editSong: 'Song'
    editTag: 'Tag'
    gift: 'Boolean'
    grantAllTitle: 'Int'
    grantTitle: 'TitleInventory'
    newTransaction: 'Payment'
    removeBias: 'Bias'
    revokeAllTitle: 'Int'
    revokeTitle: 'Int'
    rollCards: 'Card'
    setBio: 'Account'
    setFrame: 'Card'
    setUserTitle: 'Account'
    startGuessTheIdol: 'GuessTheIdol'
    startGuessTheSong: 'GuessTheSong'
    tagCard: 'Card'
    toggleFlag: 'Account'
    togglePublicSupporter: 'Account'
    updateAlias: 'Alias'
    updateCharacter: 'Character'
    updateGroup: 'Group'
    updateMinigameMessage: 'Boolean'
    updatePrefab: 'CardPrefab'
    updateRelease: 'Release'
    updateSubgroup: 'Subgroup'
    upgradeCard: 'Card'
  }
  Payment: { // field return type name
    accountId: 'Int'
    cost: 'Int'
    id: 'Int'
    paymentId: 'String'
    productId: 'Int'
    success: 'Boolean'
    url: 'String'
  }
  Product: { // field return type name
    available: 'Boolean'
    id: 'Int'
    name: 'String'
    price: 'Int'
    type: 'ProductType'
  }
  Query: { // field return type name
    aliases: 'Alias'
    canClaimPremiumRewards: 'Int'
    canClaimRewards: 'Int'
    getAnnouncements: 'Announcement'
    getBiases: 'Bias'
    getCard: 'Card'
    getCharacter: 'Character'
    getGroup: 'Group'
    getGuessTheIdol: 'GuessTheIdol'
    getGuessTheSong: 'GuessTheSong'
    getLeaderboard: 'Leaderboard'
    getSubgroup: 'Subgroup'
    getTag: 'Tag'
    getUserTitle: 'TitleInventory'
    inventory: 'Card'
    inventoryPage: 'InventoryPage'
    isEmoji: 'Boolean'
    isWordValid: 'Boolean'
    lastRelease: 'Release'
    payment: 'Payment'
    prefab: 'CardPrefab'
    products: 'Product'
    reachedPurchaseLimit: 'Boolean'
    release: 'Release'
    searchCards: 'Card'
    searchCharacters: 'Character'
    searchGroups: 'Group'
    searchPrefabs: 'CardPrefab'
    searchSubgroups: 'Subgroup'
    searchTags: 'Tag'
    searchTitles: 'Title'
    title: 'Title'
    user: 'Account'
    userTitles: 'TitleInventory'
    word: 'String'
  }
  Release: { // field return type name
    cards: 'CardPrefab'
    droppable: 'Boolean'
    id: 'Int'
  }
  Song: { // field return type name
    group: 'Group'
    groupId: 'Int'
    id: 'Int'
    release: 'Release'
    releaseId: 'Int'
    soloist: 'Character'
    soloistId: 'Int'
    title: 'String'
  }
  Subgroup: { // field return type name
    creation: 'DateTime'
    id: 'Int'
    name: 'String'
  }
  Tag: { // field return type name
    account: 'Account'
    accountId: 'Int'
    cardCount: 'Int'
    emoji: 'String'
    id: 'Int'
    tag: 'String'
    updatedAt: 'DateTime'
  }
  Title: { // field return type name
    description: 'String'
    id: 'Int'
    inventory: 'TitleInventory'
    ownedCount: 'Int'
    title: 'String'
  }
  TitleInventory: { // field return type name
    account: 'Account'
    accountId: 'Int'
    id: 'Int'
    title: 'Title'
    titleId: 'Int'
  }
}

export interface NexusGenArgTypes {
  Account: {
    minigameStats: { // args
      type: NexusGenEnums['MinigameType']; // MinigameType!
    }
  }
  Mutation: {
    addBias: { // args
      groupId: number; // Int!
    }
    answerGuessTheIdol: { // args
      answer: string; // String!
    }
    answerGuessTheSong: { // args
      answer: string; // String!
    }
    boost: { // args
      count: number; // Int!
      discordId: string; // String!
    }
    burnCard: { // args
      cardId: number; // Int!
    }
    changeCardColor: { // args
      cardId: number; // Int!
      color: number; // Int!
    }
    completeMinigame: { // args
      reward: NexusGenEnums['Reward']; // Reward!
    }
    completeTransaction: { // args
      token: string; // String!
    }
    createAccount: { // args
      username: string; // String!
    }
    createAlias: { // args
      alias: string; // String!
      groupId: number; // Int!
    }
    createCharacter: { // args
      birthday?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['Gender'] | null; // Gender
      name: string; // String!
    }
    createGroup: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
      name: string; // String!
    }
    createPrefab: { // args
      characterId: number; // Int!
      groupId?: number | null; // Int
      maxCards?: number | null; // Int
      rarity?: number | null; // Int
      releaseId?: number | null; // Int
      subgroupId?: number | null; // Int
    }
    createSong: { // args
      groupId?: number | null; // Int
      releaseId?: number | null; // Int
      soloistId?: number | null; // Int
      title: string; // String!
      url: string; // String!
    }
    createSubgroup: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      name: string; // String!
    }
    createTag: { // args
      emoji: string; // String!
      name: string; // String!
    }
    createTitle: { // args
      description?: string | null; // String
      title: string; // String!
    }
    deleteAlias: { // args
      id: number; // Int!
    }
    deleteCharacter: { // args
      id: number; // Int!
    }
    deleteGroup: { // args
      id: number; // Int!
    }
    deleteSong: { // args
      songId: number; // Int!
    }
    deleteSubgroup: { // args
      id: number; // Int!
    }
    deleteTag: { // args
      tag: string; // String!
    }
    editSong: { // args
      groupId?: number | null; // Int
      releaseId?: number | null; // Int
      soloistId?: number | null; // Int
      songId: number; // Int!
      title?: string | null; // String
    }
    editTag: { // args
      emoji?: string | null; // String
      name?: string | null; // String
      tag: string; // String!
    }
    gift: { // args
      cardIds?: number[] | null; // [Int!]
      lilies?: number | null; // Int
      petals?: number | null; // Int
      recipientId: number; // Int!
    }
    grantAllTitle: { // args
      titleId: number; // Int!
    }
    grantTitle: { // args
      accountId: number; // Int!
      titleId: number; // Int!
    }
    newTransaction: { // args
      productId: number; // Int!
    }
    removeBias: { // args
      groupId: number; // Int!
    }
    revokeAllTitle: { // args
      titleId: number; // Int!
    }
    revokeTitle: { // args
      accountId: number; // Int!
      titleId: number; // Int!
    }
    rollCards: { // args
      amount: number; // Int!
      gender?: NexusGenEnums['Gender'] | null; // Gender
    }
    setBio: { // args
      bio?: string | null; // String
    }
    setFrame: { // args
      cardId: number; // Int!
    }
    setUserTitle: { // args
      id: number; // Int!
    }
    startGuessTheIdol: { // args
      channelId?: string | null; // String
      gender?: NexusGenEnums['Gender'] | null; // Gender
      group?: string | null; // String
      guildId?: string | null; // String
      messageId?: string | null; // String
    }
    startGuessTheSong: { // args
      channelId?: string | null; // String
      gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
      group?: number | null; // Int
      guildId?: string | null; // String
      messageId?: string | null; // String
    }
    tagCard: { // args
      cardId: number; // Int!
      tag: string; // String!
    }
    toggleFlag: { // args
      accountId: number; // Int!
      flag: NexusGenEnums['Flag']; // Flag!
    }
    updateAlias: { // args
      alias?: string | null; // String
      groupId?: number | null; // Int
      id: number; // Int!
    }
    updateCharacter: { // args
      birthday?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['Gender'] | null; // Gender
      id: number; // Int!
      name?: string | null; // String
    }
    updateGroup: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
      id: number; // Int!
      name?: string | null; // String
    }
    updateMinigameMessage: { // args
      channelId: string; // String!
      guildId: string; // String!
      messageId: string; // String!
    }
    updatePrefab: { // args
      characterId?: number | null; // Int
      groupId?: number | null; // Int
      maxCards?: number | null; // Int
      prefabId: number; // Int!
      rarity?: number | null; // Int
      releaseId?: number | null; // Int
      subgroupId?: number | null; // Int
    }
    updateRelease: { // args
      droppable?: boolean | null; // Boolean
      id: number; // Int!
    }
    updateSubgroup: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      id: number; // Int!
      name?: string | null; // String
    }
    upgradeCard: { // args
      cardId: number; // Int!
      fodderCardId: number; // Int!
    }
  }
  Query: {
    aliases: { // args
      alias?: string | null; // String
      groupId?: number | null; // Int
      id?: number | null; // Int
    }
    getBiases: { // args
      accountId: number; // Int!
    }
    getCard: { // args
      id: number; // Int!
    }
    getCharacter: { // args
      id: number; // Int!
    }
    getGroup: { // args
      id: number; // Int!
    }
    getLeaderboard: { // args
      type: NexusGenEnums['LeaderboardType']; // LeaderboardType!
    }
    getSubgroup: { // args
      id: number; // Int!
    }
    getTag: { // args
      tag: string; // String!
    }
    getUserTitle: { // args
      id: number; // Int!
    }
    inventory: { // args
      character?: string | null; // String
      group?: string | null; // String
      order?: NexusGenEnums['InventoryOrder'] | null; // InventoryOrder
      page: number; // Int!
      sort?: NexusGenEnums['InventorySort'] | null; // InventorySort
      subgroup?: string | null; // String
      tag?: string | null; // String
      userId: number; // Int!
    }
    inventoryPage: { // args
      character?: string | null; // String
      group?: string | null; // String
      subgroup?: string | null; // String
      tag?: string | null; // String
      user: number; // Int!
    }
    isEmoji: { // args
      emoji: string; // String!
    }
    isWordValid: { // args
      word: string; // String!
    }
    payment: { // args
      paymentId: string; // String!
    }
    prefab: { // args
      id: number; // Int!
    }
    reachedPurchaseLimit: { // args
      productId: number; // Int!
    }
    release: { // args
      id: number; // Int!
    }
    searchCards: { // args
      exclude?: number | null; // Int
      maxQuality?: NexusGenEnums['Quality'] | null; // Quality
      minQuality?: NexusGenEnums['Quality'] | null; // Quality
      ownerId: number; // Int!
      prefabId?: number | null; // Int
      search: string; // String!
    }
    searchCharacters: { // args
      birthday?: NexusGenScalars['DateTime'] | null; // DateTime
      birthdayAfter?: NexusGenScalars['DateTime'] | null; // DateTime
      birthdayBefore?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['Gender'] | null; // Gender
      group?: string | null; // String
      maxLetters?: number | null; // Int
      minLetters?: number | null; // Int
      page?: number | null; // Int
      search: string; // String!
    }
    searchGroups: { // args
      search: string; // String!
    }
    searchPrefabs: { // args
      search: string; // String!
    }
    searchSubgroups: { // args
      search: string; // String!
    }
    searchTags: { // args
      search: string; // String!
    }
    searchTitles: { // args
      search: string; // String!
    }
    title: { // args
      id?: number | null; // Int
      title?: string | null; // String
    }
    user: { // args
      discordId?: string | null; // String
      id?: number | null; // Int
      username?: string | null; // String
    }
    userTitles: { // args
      accountId: number; // Int!
      search?: string | null; // String
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = never;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}