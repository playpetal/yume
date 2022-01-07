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
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discordId: string; // String!
    id: number; // Int!
    username: string; // String!
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
  Group: { // root type
    creation?: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
  }
  Mutation: {};
  Query: {};
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
    createdAt: NexusGenScalars['DateTime']; // DateTime!
    discordId: string; // String!
    id: number; // Int!
    username: string; // String!
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
  Group: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
  }
  Mutation: { // field return type
    assignGroup: NexusGenRootTypes['AccountUserGroup']; // AccountUserGroup!
    createAccount: NexusGenRootTypes['Account']; // Account!
    createAlias: NexusGenRootTypes['Alias']; // Alias!
    createCharacter: NexusGenRootTypes['Character']; // Character!
    createGroup: NexusGenRootTypes['Group']; // Group!
    createSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
    createUserGroup: NexusGenRootTypes['UserGroup']; // UserGroup!
    deleteAlias: number; // Int!
    deleteCharacter: number; // Int!
    deleteGroup: number; // Int!
    deleteSubgroup: number; // Int!
    unassignGroup: number; // Int!
    updateAlias: NexusGenRootTypes['Alias']; // Alias!
    updateCharacter: NexusGenRootTypes['Character']; // Character!
    updateGroup: NexusGenRootTypes['Group']; // Group!
    updateSubgroup: NexusGenRootTypes['Subgroup']; // Subgroup!
  }
  Query: { // field return type
    aliases: NexusGenRootTypes['Alias'][]; // [Alias!]!
    characters: NexusGenRootTypes['Character'][]; // [Character!]!
    groups: NexusGenRootTypes['Group'][]; // [Group!]!
    me: NexusGenRootTypes['Account'] | null; // Account
    subgroups: NexusGenRootTypes['Subgroup'][]; // [Subgroup!]!
    titles: NexusGenRootTypes['Title'][]; // [Title!]!
    user: NexusGenRootTypes['Account'] | null; // Account
  }
  Subgroup: { // field return type
    creation: NexusGenScalars['DateTime'] | null; // DateTime
    id: number; // Int!
    name: string; // String!
  }
  Title: { // field return type
    description: string | null; // String
    id: number; // Int!
    title: string; // String!
  }
  UserGroup: { // field return type
    id: number; // Int!
    members: NexusGenRootTypes['AccountUserGroup'][]; // [AccountUserGroup!]!
    name: string; // String!
  }
}

export interface NexusGenFieldTypeNames {
  Account: { // field return type name
    createdAt: 'DateTime'
    discordId: 'String'
    id: 'Int'
    username: 'String'
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
  Group: { // field return type name
    aliases: 'Alias'
    creation: 'DateTime'
    id: 'Int'
    name: 'String'
  }
  Mutation: { // field return type name
    assignGroup: 'AccountUserGroup'
    createAccount: 'Account'
    createAlias: 'Alias'
    createCharacter: 'Character'
    createGroup: 'Group'
    createSubgroup: 'Subgroup'
    createUserGroup: 'UserGroup'
    deleteAlias: 'Int'
    deleteCharacter: 'Int'
    deleteGroup: 'Int'
    deleteSubgroup: 'Int'
    unassignGroup: 'Int'
    updateAlias: 'Alias'
    updateCharacter: 'Character'
    updateGroup: 'Group'
    updateSubgroup: 'Subgroup'
  }
  Query: { // field return type name
    aliases: 'Alias'
    characters: 'Character'
    groups: 'Group'
    me: 'Account'
    subgroups: 'Subgroup'
    titles: 'Title'
    user: 'Account'
  }
  Subgroup: { // field return type name
    creation: 'DateTime'
    id: 'Int'
    name: 'String'
  }
  Title: { // field return type name
    description: 'String'
    id: 'Int'
    title: 'String'
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
      name: string; // String!
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
      id: number; // Int!
      name?: string | null; // String
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
    characters: { // args
      birthday?: NexusGenScalars['DateTime'] | null; // DateTime
      gender?: NexusGenEnums['Gender'] | null; // Gender
      id?: number | null; // Int
      name?: string | null; // String
    }
    groups: { // args
      after?: number | null; // Int
      alias?: string | null; // String
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      id?: number | null; // Int
      name?: string | null; // String
    }
    subgroups: { // args
      creation?: NexusGenScalars['DateTime'] | null; // DateTime
      id?: number | null; // Int
      name?: string | null; // String
    }
    titles: { // args
      id?: number | null; // Int
      name?: string | null; // String
    }
    user: { // args
      id?: number | null; // Int
      username?: string | null; // String
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