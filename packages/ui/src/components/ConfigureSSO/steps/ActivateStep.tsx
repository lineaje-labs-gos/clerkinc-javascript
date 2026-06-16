import { Button, Col, descriptors, Flex, Flow, Heading, Icon, localizationKeys, Text } from '@/customizables';
import { useCardState } from '@/elements/contexts';
import { ChevronRight, DuotoneShieldCheck } from '@/icons';
import { Alert } from '@/ui/elements/Alert';
import { handleError } from '@/utils/errorHandler';

import { useConfigureSSO } from '../ConfigureSSOContext';
import { Step } from '../elements/Step';

export const ActivateStep = (): JSX.Element => {
  const {
    enterpriseConnection,
    enterpriseConnectionMutations: { setConnectionActive },
    onExit,
  } = useConfigureSSO();
  const card = useCardState();

  // The activate step is only reachable with a configured connection, so the
  // domains are set; join multiples for the subtitle copy.
  const domain = (enterpriseConnection?.domains ?? []).join(', ');

  const handleActivate = async (): Promise<void> => {
    if (!enterpriseConnection || card.isLoading) {
      return;
    }

    card.setError(undefined);
    card.setLoading();

    try {
      await setConnectionActive(enterpriseConnection.id, true);
      onExit?.();
    } catch (err) {
      handleError(err as Error, [], card.setError);
    } finally {
      card.setIdle();
    }
  };

  return (
    <Flow.Part part='ssoActivate'>
      <Step
        elementDescriptor={descriptors.configureSSOStep}
        elementId={descriptors.configureSSOStep.setId('activate')}
      >
        <Step.Body>
          <Step.Section
            elementDescriptor={descriptors.configureSSOActivate}
            fill
            gap={5}
            sx={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Col
              align='center'
              sx={t => ({ textAlign: 'center', maxWidth: '332px', gap: t.space.$3x5 })}
            >
              <Icon
                elementDescriptor={descriptors.configureSSOActivateIcon}
                icon={DuotoneShieldCheck}
                size='lg'
                colorScheme='neutral'
              />

              <Col
                align='center'
                gap={2}
              >
                <Heading
                  elementDescriptor={descriptors.configureSSOActivateTitle}
                  textVariant='h2'
                  localizationKey={localizationKeys('configureSSO.activate.title')}
                />
                <Text
                  elementDescriptor={descriptors.configureSSOActivateSubtitle}
                  as='p'
                  colorScheme='secondary'
                  localizationKey={localizationKeys('configureSSO.activate.subtitle', { domain })}
                />
              </Col>

              {card.error && (
                <Alert
                  variant='danger'
                  sx={{ width: '100%' }}
                  title={card.error}
                />
              )}
            </Col>

            <Flex
              align='center'
              gap={4}
            >
              <Button
                elementDescriptor={descriptors.configureSSOActivateButton}
                variant='solid'
                size='sm'
                isLoading={card.isLoading}
                onClick={() => void handleActivate()}
                localizationKey={localizationKeys('configureSSO.activate.activateButton')}
              />

              <Button
                elementDescriptor={descriptors.configureSSOActivateSkipButton}
                variant='outline'
                size='sm'
                isDisabled={card.isLoading}
                onClick={() => onExit?.()}
              >
                <Text
                  as='span'
                  localizationKey={localizationKeys('configureSSO.activate.skipButton')}
                />
                <Icon
                  icon={ChevronRight}
                  size='sm'
                  sx={t => ({ marginInlineStart: t.space.$1 })}
                />
              </Button>
            </Flex>
          </Step.Section>
        </Step.Body>
      </Step>
    </Flow.Part>
  );
};
