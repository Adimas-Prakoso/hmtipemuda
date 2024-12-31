'use client'

import Select, { Props as SelectProps } from 'react-select'

type ClientSelectProps<T> = Omit<SelectProps<T, false>, 'theme'> & {
  instanceId?: string
}

export default function ClientSelect<T>(props: ClientSelectProps<T>) {
  return <Select<T, false> {...props} isMulti={false} />
}
