#Author = Léo Duret
#Version = 0.20
#

from html.parser import HTMLParser
import dash_core_components as dcc

selfclosing = ['img','area','base','br','col', 'command', 'embed', 'hr','input', 'keygen', 'link', 'menuitem', 'meta', 'param','source', 'track', 'wbr']
headers = ['html','head','meta', 'link', 'title', 'base','style', 'script', '!DOCTYPE html']
DCC_ATTRIBUTES = [
		'id', 'selectionStart', 'date', 'allowCross', 'max_date_allowed', 'style_disabled',
		'accept', 'minLength', 'last_modified', 'draggable', 'type', 'class', 'clickData', 'calendar_orientation', 'vertical', 'name', 'end_date', 'rows', 'min', 'selectedData', 'labelClassName', 'readonly', 'max_size', 'clearable', 'first_day_of_week', 'tabIndex', 'marks', 'inputClassName', 'count', 'is_RTL', 'display_format', 'contentEditable', 'selectionDirection', 'className_disabled', 'hoverData', 'style_active', 'day_size', 'dir', 'disabled', 'figure', 'relayoutData', 'cols', 'inputStyle', 'config', 'show_outside_days', 'updatemode', 'disable_click', 'with_full_screen_portal', 'dots', 'spellcheck', 'multi', 'start_date', 'containerProps', 'start_date_placeholder_text', 'children', 'month_format', 'min_date_allowed', 'autocomplete', 'className_active', 'labelStyle', 'filename', 'className_reject', 'readOnly', 'title', 'min_size', 'included', 'hidden', 'stay_open_on_select', 'animation_options', 'end_date_placeholder_text', 'maxLength', 'style_reject', 'autofocus', 'clear_on_unhover', 'searchable', 'form', 'contents', 'placeholder', 'multiple', 'inputmode', 'step', 'style', 'options', 'size', 'pushable', 'with_portal', 'maxlength', 'contextMenu', 'required', 'initial_visible_month', 'value', 'max', 'reopen_calendar_on_clear', 'autoFocus', 'animate', 'spellCheck', 'number_of_months_shown', 'accessKey', 'pattern', 'lang', 'minlength', 'selectionEnd', 'wrap', 'list', 'minimum_nights']
CORE_COMPONENTS = {
				'dccdropdown': {'fn': dcc.Dropdown, 'args': {'className': 'class', 'clearable': 'clearable', 'disabled': 'disabled', 'id': 'id', 'multi': 'multi', 'options': 'options', 'placeholder': 'placeholder', 'searchable': 'searchable', 'value': 'value'}},
				'dccslider': {'fn': dcc.Slider, 'args': {'className': 'class', 'disabled': 'disabled', 'dots': 'dots', 'id': 'id', 'included': 'included', 'marks': 'marks', 'max': 'max', 'min': 'min', 'step': 'step', 'updatemode': 'updatemode', 'value': 'value', 'vertical': 'vertical'}},
				'dccRangeslider': {'fn': dcc.RangeSlider, 'args': {'allowCross': 'allowCross', 'className': 'class', 'count': 'count', 'disabled': 'disabled', 'dots': 'dots', 'id': 'id', 'included': 'included', 'marks': 'marks', 'max': 'max', 'min': 'min', 'pushable': 'pushable', 'step': 'step', 'updatemode': 'updatemode', 'value': 'value', 'vertical': 'vertical'}},
				'dccinput': {'fn': dcc.Input, 'args': {'autocomplete': 'autocomplete', 'autofocus':
					'autofocus', 'className': 'class', 'id': 'id', 'inputmode': 'inputmode', 'list':
					'list', 'max': 'max', 'maxlength': 'maxlength', 'min': 'min', 'minlength': 'minlength', 'multiple': 'multiple', 'name': 'name', 'pattern': 'pattern', 'placeholder': 'placeholder', 'readonly': 'readonly', 'required': 'required', 'selectionDirection': 'selectionDirection', 'selectionEnd': 'selectionEnd', 'selectionStart': 'selectionStart', 'size': 'size', 'spellcheck': 'spellcheck', 'step': 'step', 'style': 'style', 'type': 'type', 'value': 'value'}},
				'dcctextarea': {'fn': dcc.Textarea, 'args': {'accessKey': 'accessKey','autoFocus': 'autoFocus','className': 'class','cols': 'cols','contentEditable': 'contentEditable','contextMenu': 'contextMenu','dir': 'dir','disabled': 'disabled','draggable': 'draggable','form': 'form','hidden': 'hidden','id': 'id','lang': 'lang','maxLength': 'maxLength','minLength': 'minLength','name': 'name','placeholder': 'placeholder','readOnly': 'readOnly','required': 'required','rows': 'rows','spellCheck': 'spellCheck','style': 'style','tabIndex': 'tabIndex','title': 'title','value': 'value','wrap': 'wrap'}},
				'dccradioitems': {'fn': dcc.RadioItems, 'args': {'className': 'class','id': 'id','inputClassName': 'inputClassName','inputStyle': 'inputStyle','labelClassName': 'labelClassName','labelStyle': 'labelStyle','options': 'options','style': 'style','value': 'value'}},
				'dccdatepickersingle': {'fn': dcc.DatePickerSingle, 'args': {'calendar_orientation': 'calendar_orientation','clearable': 'clearable','date': 'date','day_size': 'day_size','disabled': 'disabled','display_format': 'display_format','first_day_of_week': 'first_day_of_week','id': 'id','initial_visible_month': 'initial_visible_month','is_RTL': 'is_RTL','max_date_allowed': 'max_date_allowed','min_date_allowed': 'min_date_allowed','month_format': 'month_format','number_of_months_shown': 'number_of_months_shown','placeholder': 'placeholder','reopen_calendar_on_clear': 'reopen_calendar_on_clear','show_outside_days': 'show_outside_days','stay_open_on_select': 'stay_open_on_select','with_full_screen_portal': 'with_full_screen_portal','with_portal': 'with_portal'}},
				'dccdatepickerrange': {'fn': dcc.DatePickerRange, 'args': {'calendar_orientation': 'calendar_orientation','clearable': 'clearable','day_size': 'day_size','disabled': 'disabled','display_format': 'display_format','end_date': 'end_date','end_date_placeholder_text': 'end_date_placeholder_text','first_day_of_week': 'first_day_of_week','id': 'id','initial_visible_month': 'initial_visible_month','is_RTL': 'is_RTL','max_date_allowed': 'max_date_allowed','min_date_allowed': 'min_date_allowed','minimum_nights': 'minimum_nights','month_format': 'month_format','number_of_months_shown': 'number_of_months_shown','reopen_calendar_on_clear': 'reopen_calendar_on_clear','show_outside_days': 'show_outside_days','start_date': 'start_date','start_date_placeholder_text': 'start_date_placeholder_text','stay_open_on_select': 'stay_open_on_select','with_full_screen_portal': 'with_full_screen_portal','with_portal': 'with_portal'}},
				'dccmarkdown': {'fn': dcc.Markdown, 'args': {'children': 'children','className': 'class','containerProps': 'containerProps','id': 'id'}},
				'dccuploadcomponent': {'fn': dcc.Upload, 'args': {'accept': 'accept','children': 'children','className': 'class','className_active': 'className_active','className_disabled': 'className_disabled','className_reject': 'className_reject','contents': 'contents','disable_click': 'disable_click','disabled': 'disabled','filename': 'filename','id': 'id','last_modified': 'last_modified','max_size': 'max_size','min_size': 'min_size','multiple': 'multiple','style': 'style','style_active': 'style_active','style_disabled': 'style_disabled','style_reject': 'style_reject'}},
				'dccgraph': {'fn': dcc.Graph, 'args': {'animate': 'animate','animation_options': 'animation_options','className': 'class','clear_on_unhover': 'clear_on_unhover','clickData': 'clickData','config': 'config','figure': 'figure','hoverData': 'hoverData','id': 'id','relayoutData': 'relayoutData','selectedData': 'selectedData','style': 'style'}}
			}

class Dhtml(object):

	def __init__(self, file_in, file_out='result.py'):
		self.main_children = list()
		self.file_in = file_in
		self.file_out = file_out
		self.opened = open(file_in, 'r')

	def __str__(self):
		return "<Object Dhtml | In: {}; Out: {} | call .dparse() to write file>".format(self.file_in, self.file_out)

	def dparse(self):
		dparser = self.dHandler()

		for line in self.opened:
			dparser.feed(line)

		dparser.close()

	def dread(self):
		self.dparser.dread()

	def dprint(self):
		return print(self.opened.read())

	class dHandler(HTMLParser):

		def __init__(self):
			super().__init__()
			self.reset_dcc()
			self.reset_dcc_a()

		def updatedcc_a(self, dic):
			for key in dic:
				self.dcc_a[key] = dic.get(key, None)

		def reset_dcc_a(self):
			global DCC_ATTRIBUTES
			self.dcc_a = DCC_ATTRIBUTES.copy()

		def reset_dcc(self):
			global CORE_COMPONENTS
			self.corecomponents = CORE_COMPONENTS.copy()

		def handle_starttag(self, tag, attrs):
			global CORE_COMPONENTS
			if tag in headers:
				pass
			
			elif tag in self.corecomponents:
				self.resetdcc_a()
				dic = dict(attrs)
				self.updatedcc_a(dic)
				self.reset_dcc()
				self.main_children.append(self.corecomponents[tag])

		def handle_endtag(self, tag):
			if tag in headers:
				pass
			else:
				pass
