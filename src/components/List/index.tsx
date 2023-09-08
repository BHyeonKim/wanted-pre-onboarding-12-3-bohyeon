import { GlassIcon } from 'assets/svgs'
import classNames from 'classnames/bind'
import { ComponentProps, forwardRef } from 'react'
import { boldText } from 'utils/bold'

import styles from './list.module.scss'

const cx = classNames.bind(styles)

interface SickListProps extends ComponentProps<'li'> {
  sick: string
  selected?: boolean
  keyword?: string
}

const List = forwardRef<HTMLLIElement, SickListProps>(
  ({ sick, selected, keyword, ...props }, ref) => (
    <li className={cx('sickList', { selected: selected })} {...props} ref={ref}>
      <GlassIcon className={cx('icon')} /> {keyword ? boldText(sick, keyword) : sick}
    </li>
  ),
)

List.displayName = 'list'

export default List
