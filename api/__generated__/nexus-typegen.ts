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
  Gender: "FEMALE" | "MALE" | "NONBINARY"
  GroupGender: "COED" | "FEMALE" | "MALE"
  Quality: "BLOOM" | "BUD" | "FLOWER" | "SEED" | "SPROUT"
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
    id: number; // Int!
    username: string; // String!
  }
  AccountStats: { // root type
    cardCount: number; // Int!
    gtsCurrentGames: number; // Int!
    gtsGuessCount: number; // Int!
    gtsLastGame?: NexusGenScalars['DateTime'] | null; // DateTime
    gtsTotalGames: number; // Int!
    gtsTotalRewards: number; // Int!
    gtsTotalTime: number; // Int!
    rollCount: number; // Int!
  }
  AccountUserGroup: { // root type
    accountId: number; // Int!
    groupId: number; // Int!
    id: number; // Int!
  }
  Alias: { // root type
    alias: string; // String!
    groupId: number; // Int!
    id: number; // Int!
  }
  Card: { // root type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    issue?: number | null; // Int
    ownerId?: number | null; // Int
    prefabId: number; // Int!
    quality: NexusGenEnums['Quality']; // Quality!
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
  DiscordUser: { // root type
    avatar?: string | null; // String
    discriminator: string; // String!
    flags?: number | null; // Int
    id: string; // String!
    locale?: string | null; // String
    mfa_enabled?: boolean | null; // Boolean
    username: string; // String!
  }
  GameSong: { // root type
    group: string; // String!
    id: number; // Int!
    isNewHour: boolean; // Boolean!
    maxGuesses: number; // Int!
    maxReward: number; // Int!
    remainingGames: number; // Int!
    timeLimit: number; // Int!
    title: string; // String!
    video: string; // String!
  }
  Group: { // root type
    creation?: NexusGenScalars['DateTime'] | null; // DateTime
    gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
    id: number; // Int!
    name: string; // String!
  }
  InventoryPage: { // root type
    cards: number; // Int!
    current: number; // Int!
    max: number; // Int!
  }
  Mutation: {};
  Query: {};
  Release: { // root type
    droppable: boolean; // Boolean!
    id: number; // Int!
  }
  Song: { // root type
    groupId: number; // Int!
    id: number; // Int!
    title: string; // String!
  }
  Subgroup: { // root type
    creation?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
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
  UserGroup: { // root type
    id: number; // Int!
    name: string; // String!
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
    groups: NexusGenRootTypes['AccountUserGroup'][]; // [AccountUserGroup!]!
    id: number; // Int!
    stats: NexusGenRootTypes['AccountStats'] | null; // AccountStats
    title: NexusGenRootTypes['Title'] | null; // Title
    username: string; // String!
  }
  AccountStats: { // field return type
    cardCount: number; // Int!
    gtsCurrentGames: number; // Int!
    gtsGuessCount: number; // Int!
    gtsLastGame: NexusGenScalars['DateTime'] | null; // DateTime
    gtsTotalGames: number; // Int!
    gtsTotalRewards: number; // Int!
    gtsTotalTime: number; // Int!
    rollCount: number; // Int!
  }
  AccountUserGroup: { // field return type
    account: NexusGenRootTypes['Account'] | null; // Account
    accountId: number; // Int!
    group: NexusGenRootTypes['UserGroup'] | null; // UserGroup
    groupId: number; // Int!
    id: number; // Int!
  }
  Alias: { // field return type
    alias: string; // String!
    group: NexusGenRootTypes['Group']; // Group!
    groupId: number; // Int!
    id: number; // Int!
  }
  Card: { // field return type
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    id: number; // Int!
    issue: number | null; // Int
    owner: NexusGenRootTypes['Account'] | null; // Account
    ownerId: number | null; // Int
    prefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    prefabId: number; // Int!
    quality: NexusGenEnums['Quality']; // Quality!
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
  DiscordUser: { // field return type
    avatar: string | null; // String
    discriminator: string; // String!
    flags: number | null; // Int
    id: string; // String!
    locale: string | null; // String
    mfa_enabled: boolean | null; // Boolean
    username: string; // String!
  }
  GameSong: { // field return type
    group: string; // String!
    id: number; // Int!
    isNewHour: boolean; // Boolean!
    maxGuesses: number; // Int!
    maxReward: number; // Int!
    remainingGames: number; // Int!
    timeLimit: number; // Int!
    title: string; // String!
    video: string; // String!
  }
  Group: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    gender: NexusGenEnums['GroupGender'] | null; // GroupGender
    id: number; // Int!
    name: string; // String!
  }
  InventoryPage: { // field return type
    cards: number; // Int!
    current: number; // Int!
    max: number; // Int!
  }
  Mutation: { // field return type
    assignGroup: NexusGenRootTypes['AccountUserGroup']; // AccountUserGroup!
    burnCard: number; // Int!
    completeGts: number; // Int!
    createAccount: NexusGenRootTypes['Account']; // Account!
    createAlias: NexusGenRootTypes['Alias']; // Alias!
    createCharacter: NexusGenRootTypes['Character']; // Character!
    createGroup: NexusGenRootTypes['Group']; // Group!
    createPrefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    createRelease: NexusGenRootTypes['Release']; // Release!
    createSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
    createUserGroup: NexusGenRootTypes['UserGroup']; // UserGroup!
    deleteAlias: number; // Int!
    deleteCharacter: number; // Int!
    deleteGroup: number; // Int!
    deleteSubgroup: number; // Int!
    rollCards: NexusGenRootTypes['Card'][]; // [Card!]!
    setBio: NexusGenRootTypes['Account']; // Account!
    setMaxGtsReward: number; // Int!
    setUserTitle: NexusGenRootTypes['Account']; // Account!
    unassignGroup: number; // Int!
    updateAlias: NexusGenRootTypes['Alias']; // Alias!
    updateCharacter: NexusGenRootTypes['Character']; // Character!
    updateGroup: NexusGenRootTypes['Group']; // Group!
    updatePrefab: NexusGenRootTypes['CardPrefab']; // CardPrefab!
    updateRelease: NexusGenRootTypes['Release']; // Release!
    updateSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
  }
  Query: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    getCard: NexusGenRootTypes['Card'] | null; // Card
    getCharacter: NexusGenRootTypes['Character'] | null; // Character
    getGroup: NexusGenRootTypes['Group'] | null; // Group
    getRandomSong: NexusGenRootTypes['GameSong'] | null; // GameSong
    getSubgroup: NexusGenRootTypes['Subgroup'] | null; // Subgroup
    getUserTitle: NexusGenRootTypes['TitleInventory'] | null; // TitleInventory
    inventory: NexusGenRootTypes['Card'][]; // [Card!]!
    inventoryPage: NexusGenRootTypes['InventoryPage']; // InventoryPage!
    lastRelease: NexusGenRootTypes['Release'] | null; // Release
    me: NexusGenRootTypes['Account'] | null; // Account
    prefab: NexusGenRootTypes['CardPrefab'] | null; // CardPrefab
    release: NexusGenRootTypes['Release'] | null; // Release
    searchCards: NexusGenRootTypes['Card'][]; // [Card!]!
    searchCharacters: NexusGenRootTypes['Character'][]; // [Character!]!
    searchGroups: NexusGenRootTypes['Group'][]; // [Group!]!
    searchPrefabs: NexusGenRootTypes['CardPrefab'][]; // [CardPrefab!]!
    searchSubgroups: NexusGenRootTypes['Subgroup'][]; // [Subgroup!]!
    searchTitles: NexusGenRootTypes['Title'][]; // [Title!]!
    title: NexusGenRootTypes['Title'] | null; // Title
    user: NexusGenRootTypes['Account'] | null; // Account
    userGroups: NexusGenRootTypes['UserGroup'][]; // [UserGroup!]!
    userTitles: NexusGenRootTypes['TitleInventory'][]; // [TitleInventory!]!
  }
  Release: { // field return type
    cards: NexusGenRootTypes['CardPrefab'][]; // [CardPrefab!]!
    droppable: boolean; // Boolean!
    id: number; // Int!
  }
  Song: { // field return type
    group: NexusGenRootTypes['Group'] | null; // Group
    groupId: number; // Int!
    id: number; // Int!
    title: string; // String!
  }
  Subgroup: { // field return type
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
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
  UserGroup: { // field return type
    id: number; // Int!
    members: NexusGenRootTypes['AccountUserGroup'][]; // [AccountUserGroup!]!
    name: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Account: { // field return type name
    activeTitleId: 'Int'
    bio: 'String'
    createdAt: 'DateTime'
    currency: 'Int'
    discordId: 'String'
    groups: 'AccountUserGroup'
    id: 'Int'
    stats: 'AccountStats'
    title: 'Title'
    username: 'String'
  }
  AccountStats: { // field return type name
    cardCount: 'Int'
    gtsCurrentGames: 'Int'
    gtsGuessCount: 'Int'
    gtsLastGame: 'DateTime'
    gtsTotalGames: 'Int'
    gtsTotalRewards: 'Int'
    gtsTotalTime: 'Int'
    rollCount: 'Int'
  }
  AccountUserGroup: { // field return type name
    account: 'Account'
    accountId: 'Int'
    group: 'UserGroup'
    groupId: 'Int'
    id: 'Int'
  }
  Alias: { // field return type name
    alias: 'String'
    group: 'Group'
    groupId: 'Int'
    id: 'Int'
  }
  Card: { // field return type name
    createdAt: 'DateTime'
    id: 'Int'
    issue: 'Int'
    owner: 'Account'
    ownerId: 'Int'
    prefab: 'CardPrefab'
    prefabId: 'Int'
    quality: 'Quality'
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
  DiscordUser: { // field return type name
    avatar: 'String'
    discriminator: 'String'
    flags: 'Int'
    id: 'String'
    locale: 'String'
    mfa_enabled: 'Boolean'
    username: 'String'
  }
  GameSong: { // field return type name
    group: 'String'
    id: 'Int'
    isNewHour: 'Boolean'
    maxGuesses: 'Int'
    maxReward: 'Int'
    remainingGames: 'Int'
    timeLimit: 'Int'
    title: 'String'
    video: 'String'
  }
  Group: { // field return type name
    aliases: 'Alias'
    creation: 'DateTime'
    gender: 'GroupGender'
    id: 'Int'
    name: 'String'
  }
  InventoryPage: { // field return type name
    cards: 'Int'
    current: 'Int'
    max: 'Int'
  }
  Mutation: { // field return type name
    assignGroup: 'AccountUserGroup'
    burnCard: 'Int'
    completeGts: 'Int'
    createAccount: 'Account'
    createAlias: 'Alias'
    createCharacter: 'Character'
    createGroup: 'Group'
    createPrefab: 'CardPrefab'
    createRelease: 'Release'
    createSubgroup: 'Subgroup'
    createUserGroup: 'UserGroup'
    deleteAlias: 'Int'
    deleteCharacter: 'Int'
    deleteGroup: 'Int'
    deleteSubgroup: 'Int'
    rollCards: 'Card'
    setBio: 'Account'
    setMaxGtsReward: 'Int'
    setUserTitle: 'Account'
    unassignGroup: 'Int'
    updateAlias: 'Alias'
    updateCharacter: 'Character'
    updateGroup: 'Group'
    updatePrefab: 'CardPrefab'
    updateRelease: 'Release'
    updateSubgroup: 'Subgroup'
  }
  Query: { // field return type name
    aliases: 'Alias'
    getCard: 'Card'
    getCharacter: 'Character'
    getGroup: 'Group'
    getRandomSong: 'GameSong'
    getSubgroup: 'Subgroup'
    getUserTitle: 'TitleInventory'
    inventory: 'Card'
    inventoryPage: 'InventoryPage'
    lastRelease: 'Release'
    me: 'Account'
    prefab: 'CardPrefab'
    release: 'Release'
    searchCards: 'Card'
    searchCharacters: 'Character'
    searchGroups: 'Group'
    searchPrefabs: 'CardPrefab'
    searchSubgroups: 'Subgroup'
    searchTitles: 'Title'
    title: 'Title'
    user: 'Account'
    userGroups: 'UserGroup'
    userTitles: 'TitleInventory'
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
    title: 'String'
  }
  Subgroup: { // field return type name
    creation: 'DateTime'
    id: 'Int'
    name: 'String'
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
  UserGroup: { // field return type name
    id: 'Int'
    members: 'AccountUserGroup'
    name: 'String'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    assignGroup: { // args
      accountId: number; // Int!
      groupId: number; // Int!
    }
    burnCard: { // args
      cardId: number; // Int!
    }
    completeGts: { // args
      correct: boolean; // Boolean!
      guesses: number; // Int!
      isNewHour: boolean; // Boolean!
      reward: number; // Int!
      time: number; // Int!
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
    createSubgroup: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      name: string; // String!
    }
    createUserGroup: { // args
      name: string; // String!
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
    deleteSubgroup: { // args
      id: number; // Int!
    }
    rollCards: { // args
      amount: number; // Int!
      gender?: NexusGenEnums['Gender'] | null; // Gender
    }
    setBio: { // args
      bio?: string | null; // String
    }
    setMaxGtsReward: { // args
      maxReward: number; // Int!
    }
    setUserTitle: { // args
      id: number; // Int!
    }
    unassignGroup: { // args
      accountId: number; // Int!
      groupId: number; // Int!
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
  }
  Query: {
    aliases: { // args
      alias?: string | null; // String
      groupId?: number | null; // Int
      id?: number | null; // Int
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
    getRandomSong: { // args
      gender?: NexusGenEnums['GroupGender'] | null; // GroupGender
    }
    getSubgroup: { // args
      id: number; // Int!
    }
    getUserTitle: { // args
      id: number; // Int!
    }
    inventory: { // args
      next?: number | null; // Int
      prev?: number | null; // Int
      user: number; // Int!
    }
    inventoryPage: { // args
      cursor: number; // Int!
      user: number; // Int!
    }
    prefab: { // args
      id: number; // Int!
    }
    release: { // args
      id: number; // Int!
    }
    searchCards: { // args
      ownerId: number; // Int!
      search: string; // String!
    }
    searchCharacters: { // args
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
    searchTitles: { // args
      search: string; // String!
    }
    title: { // args
      id: number; // Int!
    }
    user: { // args
      discordId?: string | null; // String
      id?: number | null; // Int
      username?: string | null; // String
    }
    userGroups: { // args
      exact?: string | null; // String
      search?: string | null; // String
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