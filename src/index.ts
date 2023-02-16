import unserialize from './unserialize'
import serialize from './serialize'
import isSerialized from './isSerialized'

export { serialize, unserialize, isSerialized }

export interface Serializable {
  serialize(): string;

  unserialize(rawData: string): unknown
}
