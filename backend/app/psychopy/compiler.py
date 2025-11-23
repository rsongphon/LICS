import os
from jinja2 import Environment, FileSystemLoader
from typing import Dict, Any

class PsychoPyCompiler:
    def __init__(self):
        template_dir = os.path.join(os.path.dirname(__file__), 'templates')
        self.env = Environment(loader=FileSystemLoader(template_dir))
        
        def to_python_literal(value):
            if value is None:
                return 'None'
            if isinstance(value, bool):
                return 'True' if value else 'False'
            return repr(value)
            
        self.env.filters['python_val'] = to_python_literal

    def compile(self, experiment_name: str, psyexp_data: Dict[str, Any]) -> str:
        """
        Compiles the experiment data into a Python script using Jinja2 templates.
        """
        main_template = self.env.get_template('experiment.py.j2')
        
        # Extract nodes and edges
        nodes = psyexp_data.get('react_flow', {}).get('nodes', [])
        component_props = psyexp_data.get('component_props', {})

        # Process nodes to generate initialization code
        components_code = []
        for node in nodes:
            node_type = node.get('type')
            node_id = node.get('id')
            props = component_props.get(node_id, {})
            
            # Merge node data with props (props take precedence)
            # Also ensure label is safe variable name
            if 'label' not in node.get('data', {}):
                 node['data']['label'] = f"component_{node_id}"
            
            # Sanitize label to be valid python variable
            label = "".join(x for x in node['data']['label'] if x.isalnum() or x == "_")
            if not label or label[0].isdigit():
                label = f"component_{label}"
            node['data']['label'] = label

            try:
                if node_type == 'text':
                    tmpl = self.env.get_template('components/text.py.j2')
                    code = tmpl.render(node=node, props=props)
                    components_code.append(code)
                elif node_type == 'image':
                    tmpl = self.env.get_template('components/image.py.j2')
                    code = tmpl.render(node=node, props=props)
                    components_code.append(code)
                elif node_type == 'keyboard':
                    tmpl = self.env.get_template('components/keyboard.py.j2')
                    code = tmpl.render(node=node, props=props)
                    components_code.append(code)
                elif node_type == 'gpio':
                    tmpl = self.env.get_template('components/gpio.py.j2')
                    code = tmpl.render(node=node, props=props)
                    components_code.append(code)
            except Exception as e:
                print(f"Error rendering component {node_id}: {e}")
                continue
        
        context = {
            'expName': experiment_name,
            'components_code': components_code,
        }
        
        return main_template.render(context)

compiler = PsychoPyCompiler()
