import { Button, Col, descriptors, Flex, Flow, Heading, Icon, localizationKeys, Text } from '@/customizables';
import { useCardState } from '@/elements/contexts';
import { ChevronRight, ShieldCheck } from '@/icons';
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
  // domains are set; join multiples for the warning copy.
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
            fill
            sx={{ alignItems: 'center', justifyContent: 'center' }}
          >
            <Col
              elementDescriptor={descriptors.configureSSOActivate}
              align='center'
              gap={4}
              sx={{ textAlign: 'center', maxWidth: '26rem' }}
            >
              <Icon
                elementDescriptor={descriptors.configureSSOActivateIcon}
                icon={ShieldCheck}
                size='lg'
                colorScheme='neutral'
              />

              <Col
                align='center'
                gap={1}
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
                  localizationKey={localizationKeys('configureSSO.activate.subtitle')}
                />
              </Col>

              <Alert
                variant='warning'
                sx={{ width: '100%' }}
                title={localizationKeys('configureSSO.activate.warning', { domain })}
              />

              {card.error && (
                <Alert
                  variant='danger'
                  sx={{ width: '100%' }}
                  title={card.error}
                />
              )}

              <Flex
                align='center'
                gap={3}
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
            </Col>
          </Step.Section>
        </Step.Body>
      </Step>
    </Flow.Part>
  );
};
