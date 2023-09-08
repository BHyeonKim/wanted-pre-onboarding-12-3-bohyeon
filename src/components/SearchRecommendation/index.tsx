import classNames from 'classnames/bind'
import List from 'components/List'
import { useEffect, useRef, useState } from 'react'
import { useAppSelector } from 'redux/hooks'

import styles from './searchRecommendation.module.scss'

const cx = classNames.bind(styles)

const START_INDEX = -1

const SearchRecommendation = () => {
  const { sicks, input } = useAppSelector((state) => state.sicks)
  const [itemIndex, setItemIndex] = useState(START_INDEX)
  const listRef = useRef<HTMLLIElement>(null)

  useEffect(() => {
    if (!listRef.current) return
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [itemIndex])

  useEffect(() => {
    setItemIndex(START_INDEX)
  }, [input])

  useEffect(() => {
    const handleSelectItem = (e: KeyboardEvent) => {
      if (e.isComposing) return
      setItemIndex((index) => {
        if (e.key === 'ArrowDown' && index < sicks.length - 1) {
          return index + 1
        } else if (e.key === 'ArrowUp' && index > START_INDEX) return index - 1
        return index
      })
    }
    window.addEventListener('keydown', handleSelectItem)

    return () => window.removeEventListener('keydown', handleSelectItem)
  }, [sicks.length])

  return (
    <ul className={cx('recommendation')}>
      {input.length !== 0 && <List selected={itemIndex === START_INDEX} sick={input} />}
      <p>추천 검색어</p>
      {sicks.map((sick, index) => {
        const key = `${index}-${sick.sickNm}`
        return (
          <List
            key={key}
            keyword={input}
            ref={index === itemIndex ? listRef : undefined}
            selected={index === itemIndex}
            sick={sick.sickNm}
          />
        )
      })}
    </ul>
  )
}

export default SearchRecommendation
