import React from 'react'
import styled from 'styled-components/macro'
import { Link } from 'react-router-dom'
import { Invert, fg, base, focus, borderRadius } from 'utils/theme'
import { format } from 'utils/dinero'
import { useCurrencyForex } from 'hooks/forex'

const padding = `calc(1rem - 0.5px) calc(0.5rem - 1px)`

export const Wrapper = styled.div`
  border-radius: ${borderRadius};
  border: 1px solid ${fg};
`

const Flex = styled.div`
  ${base}
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Currency = styled.h3`
  font-size: 1rem;
  line-height: 1.5rem;
  font-weight: 600;
  padding: ${padding};
`

const Amount = styled.div`
  font-weight: 400;
  font-size: 1.5rem;
  line-height: 1.5rem;
  padding: ${padding};
  letter-spacing: -0.025rem;
`

const ForexGroup = styled(Flex)`
  border-bottom-left-radius: ${borderRadius};
  border-bottom-right-radius: ${borderRadius};
`

const ForexWrapper = styled(Flex)`
  ${focus}
  text-decoration: none;
  overflow: hidden;
  position: relative;
  & + &::before {
    content: '';
    position: absolute;
    width: 1px;
    height: 100%;
    background: ${fg};
    pointer-events: none;
  }
  &:first-of-type {
    border-bottom-left-radius: ${borderRadius};
  }
  &:last-of-type {
    border-bottom-right-radius: ${borderRadius};
  }
  &:focus {
    z-index: 1;
  }
`

const ForexCurrency = styled.div`
  padding: ${padding};
  font-size: 0.75rem;
  line-height: 1rem;
  font-weight: 600;
`
const ForexRate = styled.div`
  padding: ${padding};
  font-size: 0.875rem;
  line-height: 1rem;
`

const Header = ({ currency, amount, ...props }) => (
  <Invert>
    <Flex {...props}>
      <Currency>{currency}</Currency>
      <Amount>{amount}</Amount>
    </Flex>
  </Invert>
)

/* istanbul ignore else */ if (process.env.NODE_ENV !== 'production') {
  Header.defaultProps = { 'data-testid': 'PocketCardHeader' }
}

const Forex = ({ from, to, rate }) => (
  <ForexWrapper as={Link} to={`/exchange/${from}x${to}`}>
    <ForexCurrency>{to}</ForexCurrency>
    <ForexRate>{rate}</ForexRate>
  </ForexWrapper>
)

const PocketCard = ({ fund, ...props }) => {
  const [formatted, currency] = [format(fund), fund.getCurrency()]
  const { rates } = useCurrencyForex(currency)
  /* istanbul ignore else */ if (process.env.NODE_ENV !== 'production') {
    props['data-testid'] = props['data-testid'] || `PocketCard-${currency}`
  }
  return (
    <Wrapper {...props}>
      <Header currency={currency} amount={formatted} />
      {!!rates && (
        <ForexGroup>
          {Object.entries(rates).map(([to, rate]) => (
            <Forex key={to} from={currency} to={to} rate={rate} />
          ))}
        </ForexGroup>
      )}
    </Wrapper>
  )
}

export default PocketCard
