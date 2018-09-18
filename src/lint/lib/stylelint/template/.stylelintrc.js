module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'font-family-no-missing-generic-family-keyword': [
      true,
      {
        severity: 'warning'
      }
    ],
    'selector-pseudo-element-colon-notation': null,
    'number-leading-zero': 'never',
    'no-descending-specificity': [
      true,
      {
        severity: 'warning'
      }
    ],
    indentation: [
      4,
      {
        severity: 'warning'
      }
    ]
  }
}
